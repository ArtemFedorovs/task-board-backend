import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Task } from '../task/entities/task.entity';
import { Board } from '../board/entities/board.entity';
import appConfig from './app.config';

export const dataSourceСonfig: DataSourceOptions = {
  type: 'postgres',
  host: appConfig().dbHost,
  port: +appConfig().dbPort,
  username: appConfig().dbUsername,
  password: appConfig().dbPassword,
  database: appConfig().dbName,
  migrations: ['migrations/**'],
  entities: [User, Task, Board],
  ssl: true,
};

const dataSource = new DataSource(dataSourceСonfig);

export default dataSource;
