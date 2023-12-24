import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { AuthGuard, TokenDataModel } from '../utility/auth.guard';

@WebSocketGateway()
export class NotificationGateway {
  //constructor(
    // private readonly notificationService: NotificationService
    // private readonly userConnections = new Map<string, Socket>(),
  //) {}

  @WebSocketServer() server: Server;
  private readonly userConnections = new Map<string, Socket>();

  // @UseGuards(AuthGuard)
  handleConnection(client: Socket) {
    // AuthGuard.canActivate
    const userId = client.handshake.headers.authorization as string;
    this.userConnections.set(userId, client);
  }

  // sendMessageToClients(userIds: [number], message: string) {
  //   this.server.to(userId).emit('taskStatusChange', message);
  // }

  sendPeriodicMessage() {
    setInterval(() => {
      this.server.emit('message', 'Hello from server!');
    }, 1000);
  }

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    setInterval(() => {
      this.server.emit('message', 'Hello from server!');
    }, 5000);
    return data;
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string): void {
    this.server.emit('message', data);
  }

  // @SubscribeMessage('events')
  // handleEvent(@MessageBody() data: string): string {
  //   return data;
  // }

  // @SubscribeMessage('createNotification')
  // create(@MessageBody() createNotificationDto: CreateNotificationDto) {
  //   return this.notificationService.create(createNotificationDto);
  // }

  // @SubscribeMessage('findAllNotification')
  // findAll() {
  //   return this.notificationService.findAll();
  // }

  // @SubscribeMessage('findOneNotification')
  // findOne(@MessageBody() id: number) {
  //   return this.notificationService.findOne(id);
  // }

  // @SubscribeMessage('updateNotification')
  // update(@MessageBody() updateNotificationDto: UpdateNotificationDto) {
  //   return this.notificationService.update(updateNotificationDto.id, updateNotificationDto);
  // }

  // @SubscribeMessage('removeNotification')
  // remove(@MessageBody() id: number) {
  //   return this.notificationService.remove(id);
  // }
}
