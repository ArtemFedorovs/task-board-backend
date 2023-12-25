import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { ConfigModule } from '@nestjs/config';
import { jwtСonfig } from '../config/jwt-config';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../utility/auth.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: () => jwtСonfig,
    }),
  ],
  providers: [NotificationGateway, NotificationService, AuthGuard],
})
export class NotificationModule {}
