import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthGuard } from '../utility/auth.guard';

@WebSocketGateway()
export class NotificationGateway {
  constructor(private readonly authGuard: AuthGuard) {}

  @WebSocketServer() server: Server;
  private readonly userConnections = new Map<number, Socket>();

  async handleConnection(client: Socket) {
    try {
      const payload = await this.authGuard.verifyToken(
        client.handshake.headers.authorization,
      );
      this.userConnections.set(+payload.sub, client);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: any) {
    for (const [key, value] of this.userConnections.entries()) {
      if (value === client) {
        this.userConnections.delete(key);
        break;
      }
    }
  }

  sendMessageToClient(clientId: number, event: string, message: string) {
    const client = this.userConnections.get(clientId);
    console.log(`Sending message to ${clientId}: ${message}`);
    if (client) {
      client.emit(event, message);
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
