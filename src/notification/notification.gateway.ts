import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthGuard } from '../core/auth.guard';

@WebSocketGateway()
export class NotificationGateway {
  constructor(private readonly authGuard: AuthGuard) {}

  @WebSocketServer() server: Server;
  private readonly userConnections: Socket[] = [];
  private readonly delayedMessages: string[][] = [];

  async handleConnection(client: Socket) {
    try {
      const payload = await this.authGuard.verifyToken(
        client.handshake.headers.authorization,
      );
      const clientId = +payload.sub;
      this.userConnections[clientId] = client;

      this.delayedMessages[clientId] &&
        this.delayedMessages[clientId].forEach((clientMessage) =>
          this.sendMessageToClient(clientId, 'notification', clientMessage),
        );
      this.delayedMessages[clientId] = undefined;
    } catch (error) {
      console.log(error);
      client.disconnect();
    }
  }

  handleDisconnect(client: any) {
    const clientId = this.userConnections.findIndex(
      (connection) => connection === client,
    );
    this.userConnections[clientId] = undefined;
  }

  sendMessageToClient(clientId: number, event: string, message: string) {
    const client = this.userConnections[clientId];
    console.log(`Sending message to ${clientId}: ${message}`);
    if (client) {
      client.emit(event, message);
    } else {
      if (this.delayedMessages[clientId]) {
        this.delayedMessages[clientId].push(message);
      } else {
        this.delayedMessages[clientId] = [message];
      }
    }
  }

  sendMessageToClients(
    clientIds: number[],
    event: string,
    message: string,
  ): void {
    for (const clientId of clientIds) {
      this.sendMessageToClient(clientId, event, message);
    }
  }
}
