import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

@WebSocketGateway()
export class NotificationGateway {
  // constructor(private readonly notificationService: NotificationService) {}

  @WebSocketServer() server: Server;

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
