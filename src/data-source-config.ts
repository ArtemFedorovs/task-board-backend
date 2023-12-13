import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './users/entities/user.entity';
import { Task } from './task/entities/task.entity';
import { Board } from './board/entities/board.entity';

const configService = new ConfigService();

const dataSourceСonfig = new DataSource({
  type: 'postgres',
  host: 'ep-autumn-shadow-54492250-pooler.eu-central-1.postgres.vercel-storage.com',
  port: +configService.get('DB_PORT'),
  username: 'default',
  password: 'kQAu5Kgi2cIO',
  database: 'verceldb',
  migrations: ['src/migrations/**'],
  entities: [User, Task, Board],
  ssl: true,
});

export default dataSourceСonfig;
