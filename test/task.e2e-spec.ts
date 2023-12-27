import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ValidationPipe } from '@nestjs/common';
import { MailerService } from '../src/core/mailer.service';
import { AuthGuard } from '../src/core/auth.guard';
import { User } from '../src/users/entities/user.entity';
import { Task } from '../src/task/entities/task.entity';
import { Board } from '../src/board/entities/board.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { jwtСonfig } from '../src/config/jwt-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from '../src/task/task.service';
import { TaskController } from '../src/task/task.controller';
import { dataSourceСonfig } from '../src/config/data-source-config';
import { NotificationGateway } from '../src/notification/notification.gateway';

describe('TaskController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
          useFactory: () => dataSourceСonfig,
        }),
        TypeOrmModule.forFeature([User, Task, Board]),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: () => jwtСonfig,
        }),
      ],
      controllers: [TaskController],
      providers: [
        TaskService,
        NotificationGateway,
        {
          provide: NotificationGateway,
          useValue: {
            sendMessageToClients: () => {
              console.log('ws message was send');
            },
          },
        },
        {
          provide: MailerService,
          useValue: {
            sendVerificationMail: () => {
              console.log('Email was send');
            },
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('/task/boards/{boardId}/tasks  (POST)', () => {
    it('should create task', async () => {
      const createTaskDto = {
        title: 'testTask',
        description: 'testTask',
        expired_at: '2023-12-27T16:20:58.378Z',
      };

      const response = await request(app.getHttpServer())
        .post('/task/boards/4/tasks')
        .set('user-id', '34')
        .send(createTaskDto)
        .expect(201);

      expect(response.body).toMatchObject({
        message: 'Task created successfully',
      });
    });
  });

  describe('/task/boards/{boardId}/tasks (GET)', () => {
    it('should get tasks', async () => {
      await request(app.getHttpServer())
        .get('/task/boards/4/tasks')
        .set('user-id', '34')
        .send()
        .expect(200);
    });
    it('shouldnt get tasks of not existing board', async () => {
      await request(app.getHttpServer())
        .get('/task/boards/999999/tasks')
        .set('user-id', '34')
        .send()
        .expect(404);
    });
  });

  describe('/task/boards/{boardId}/tasks/{taskId} (GET)', () => {
    it('should get task', async () => {
      const response = await request(app.getHttpServer())
        .get('/task/boards/4/tasks/8')
        .set('user-id', '34')
        .send()
        .expect(200);

      expect(response.body.title).toMatch('string');
    });
    it('shouldnt get not existing taskd', async () => {
      await request(app.getHttpServer())
        .get('/task/boards/4/tasks/89999')
        .set('user-id', '34')
        .send()
        .expect(404);
    });
  });

  describe('/task/boards/{boardId}/tasks/{taskId} (PUT)', () => {
    it('should update task', async () => {
      const response = await request(app.getHttpServer())
        .put('/task/boards/4/tasks/8')
        .set('user-id', '34')
        .send({
          title: 'string',
          description: 'string',
          assignedTo: 3,
          status: 'Blocked',
        })
        .expect(200);

      expect(response.body).toMatchObject({
        message: 'Task updated successfully',
      });
    });
    it('shouldnt update not existing task', async () => {
      await request(app.getHttpServer())
        .put('/task/boards/4/tasks/1')
        .set('user-id', '34')
        .send({
          title: 'string',
          description: 'string',
          assignedTo: 3,
          status: 'Blocked',
        })
        .expect(404);
    });
  });

  describe('/task/boards/{boardId}/tasks/{taskId}/status (PUT)', () => {
    it('should update status of task', async () => {
      const response = await request(app.getHttpServer())
        .put('/task/boards/4/tasks/8/status')
        .set('user-id', '34')
        .send({
          status: 'Blocked',
        })
        .expect(200);

      expect(response.body).toMatchObject({
        message: 'Task status updated successfully',
      });
    });
    it('shouldnt update status of not existing task', async () => {
      await request(app.getHttpServer())
        .put('/task/boards/4/tasks/1/status')
        .set('user-id', '34')
        .send({
          status: 'Blocked',
        })
        .expect(404);
    });
  });

  describe('/task/boards/{boardId}/tasks/{taskId}/assign (PUT)', () => {
    it('should update task assigned user', async () => {
      const response = await request(app.getHttpServer())
        .put('/task/boards/4/tasks/8/assign')
        .set('user-id', '34')
        .send({
          assignedTo: 3,
        })
        .expect(200);

      expect(response.body).toMatchObject({
        message: 'Task updated successfully',
      });
    });
    it('shouldnt update not existing task assigned user', async () => {
      await request(app.getHttpServer())
        .put('/task/boards/4/tasks/1/assign')
        .set('user-id', '34')
        .send({
          assignedTo: 3,
        })
        .expect(404);
    });
    it('shouldnt update task if user not exist assigned user', async () => {
      await request(app.getHttpServer())
        .put('/task/boards/4/tasks/1/assign')
        .set('user-id', '34')
        .send({
          assignedTo: 3658568,
        })
        .expect(404);
    });
  });
});
