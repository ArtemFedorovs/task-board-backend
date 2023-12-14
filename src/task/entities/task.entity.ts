import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Board } from '../../board/entities/board.entity';
import { Status } from '../constants';

@Entity({ name: 'task' })
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Board, (user) => user.tasks)
  board: Board;

  @ManyToOne(() => User, (user) => user.created_tasks)
  creator: User;

  @ManyToOne(() => User, (user) => user.assigned_tasks)
  assigned_user: User;

  @Column({
    type: 'enum',
    enum: Status,
    nullable: true,
  })
  status: Status;

  @Column({ type: 'date', nullable: true })
  expired_at: Date;
}