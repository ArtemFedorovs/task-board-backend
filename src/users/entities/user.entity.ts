import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Board } from '../../board/entities/board.entity';
import { Task } from '../../task/entities/task.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  user_email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'text', nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  surname: string;

  @OneToMany(() => Board, (board) => board.owner)
  owned_boards: Board[];

  @ManyToMany(() => Board)
  @JoinTable()
  boards: Board[];

  @OneToMany(() => Task, (task) => task.assigned_user)
  assigned_tasks: Board[];

  @OneToMany(() => Task, (task) => task.creator)
  created_tasks: Board[];
}
