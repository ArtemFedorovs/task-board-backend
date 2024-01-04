import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { ConfigModule } from '@nestjs/config';
import { jwtСonfig } from '../config/jwt-config';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../core/auth.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: () => jwtСonfig,
    }),
  ],
  providers: [NotificationGateway, AuthGuard],
})
export class NotificationModule {}
