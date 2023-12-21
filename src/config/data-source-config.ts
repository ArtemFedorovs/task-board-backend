import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Task } from '../task/entities/task.entity';
import { Board } from '../board/entities/board.entity';
import 'dotenv/config';

export const dataSourceСonfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  migrations: ['dist/migrations/*.js'],
  entities: [User, Task, Board],
  ssl: true,
};

const dataSource = new DataSource(dataSourceСonfig);

export default dataSource;
