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

  @Column({ type: 'boolean', default: false })
  is_email_verified: boolean;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'text', nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  surname: string;

  @OneToMany(() => Board, (board) => board.owner, { nullable: true })
  owned_boards: Board[];

  @ManyToMany(() => Board)
  @JoinTable()
  boards: Board[];

  @OneToMany(() => Task, (task) => task.assigned_user, { nullable: true })
  assigned_tasks: Task[];

  @OneToMany(() => Task, (task) => task.creator, { nullable: true })
  created_tasks: Task[];

  @ManyToMany(() => Task, {
    cascade: true,
    nullable: true,
  })
  @JoinTable()
  tracked_tasks: Task[];
}
