import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '../src/core/auth.guard';
import { User } from '../src/users/entities/user.entity';
import { Board } from '../src/board/entities/board.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { jwtСonfig } from '../src/config/jwt-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardService } from '../src/board/board.service';
import { BoardController } from '../src/board/board.controller';
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
        TypeOrmModule.forFeature([User, Board]),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: () => jwtСonfig,
        }),
      ],
      controllers: [BoardController],
      providers: [
        BoardService,
        NotificationGateway,
        {
          provide: NotificationGateway,
          useValue: {
            sendMessageToClients: () => {
              console.log('ws message was send');
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

  describe('/board  (POST)', () => {
    it('should create board', async () => {
      const createBoardDto = {
        title: 'Test title',
        description: 'Test description',
      };

      const response = await request(app.getHttpServer())
        .post('/board')
        .set('user-id', '34')
        .send(createBoardDto)
        .expect(201);

      expect(response.body).toMatchObject({
        message: 'Board created successfully',
      });
    });
  });

  describe('/board/boards  (GET)', () => {
    it('should get boards', async () => {
      const response = await request(app.getHttpServer())
        .get('/board/boards')
        .set('user-id', '34')
        .send()
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('/board/boards/{boardId}  (GET)', () => {
    it('should get board', async () => {
      const response = await request(app.getHttpServer())
        .get('/board/boards/4 ')
        .set('user-id', '34')
        .send()
        .expect(200);

      expect(response.body).toMatchObject({
        id: 4,
        title: 'string2',
        description: 'string2',
      });
    });

    it('shouldnt get not existing board', async () => {
      await request(app.getHttpServer())
        .get('/board/boards/9999 ')
        .set('user-id', '34')
        .send()
        .expect(404);
    });
  });

  describe('/board/boards/{boardId}  (Put)', () => {
    it('should update board', async () => {
      const updateBoardDto = {
        title: 'string2',
        description: 'string2',
      };
      const response = await request(app.getHttpServer())
        .put('/board/boards/4 ')
        .set('user-id', '34')
        .send(updateBoardDto)
        .expect(200);

      expect(response.body).toMatchObject({
        message: 'Board updated successfully',
      });
    });

    it('shouldnt update not existing board', async () => {
      const updateBoardDto = {
        title: 'string2',
        description: 'string2',
      };
      await request(app.getHttpServer())
        .put('/board/boards/9999 ')
        .set('user-id', '34')
        .send(updateBoardDto)
        .expect(404);
    });
  });

  describe('/board/boards/{boardId}/invite  (POST)', () => {
    it('should invite user to the board', async () => {
      const response = await request(app.getHttpServer())
        .post('/board/boards/4/invite')
        .set('user-id', '34')
        .send({ userId: 3 })
        .expect(200);

      expect(response.body).toMatchObject({
        message: 'User invited to the board',
      });
    });

    it('shouldnt invite not existing user to the board', async () => {
      await request(app.getHttpServer())
        .post('/board/boards/4/invite')
        .set('user-id', '34')
        .send({ userId: 99999 })
        .expect(404);
    });

    it('shouldnt invite  user to the not existing board', async () => {
      await request(app.getHttpServer())
        .post('/board/boards/99999/invite')
        .set('user-id', '34')
        .send({ userId: 3 })
        .expect(404);
    });
  });

  describe('/board/boards/{boardId}/remove-user  (POST)', () => {
    it('should remove user from the board', async () => {
      const response = await request(app.getHttpServer())
        .post('/board/boards/4/remove-user')
        .set('user-id', '34')
        .send({ userId: 3 })
        .expect(200);

      expect(response.body).toMatchObject({
        message: 'User removed from the board',
      });
    });

    it('shouldnt remove not existing user to the board', async () => {
      await request(app.getHttpServer())
        .post('/board/boards/4/remove-user')
        .set('user-id', '34')
        .send({ userId: 99999 })
        .expect(404);
    });

    it('shouldnt remove user from the not existing board', async () => {
      await request(app.getHttpServer())
        .post('/board/boards/99999/remove-user')
        .set('user-id', '34')
        .send({ userId: 3 })
        .expect(404);
    });
  });
});
