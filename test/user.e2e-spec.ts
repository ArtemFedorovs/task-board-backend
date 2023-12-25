import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ValidationPipe } from '@nestjs/common';
import { MailerService } from '../src/utility/mailer.service';
import { AuthGuard } from '../src/utility/auth.guard';
import { User } from '../src/users/entities/user.entity';
import { Task } from '../src/task/entities/task.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { jwtСonfig } from '../src/config/jwt-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../src/users/users.service';
import { UsersController } from '../src/users/users.controller';
import { dataSourceСonfig } from '../src/config/data-source-config';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
          useFactory: () => dataSourceСonfig,
        }),
        TypeOrmModule.forFeature([User, Task]),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: () => jwtСonfig,
        }),
      ],
      controllers: [UsersController],
      providers: [
        UsersService,
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

  describe('/users/create (POST)', () => {
    it('should create a user', async () => {
      const createUserDto = {
        email: `test${Date.now()}@example.com`,
        name: 'John',
        surname: 'Doe',
        password: 'securePassword',
      };

      const response = await request(app.getHttpServer())
        .post('/users/create')
        .send(createUserDto)
        .expect(201);

      expect(response.body).toMatchObject({
        message: 'User registered successfully',
      });
    });

    it('shouldnt create a user if email is not valid', async () => {
      const createUserDto = {
        email: 'invalidemail2',
        name: 'John',
        surname: 'Doe',
        password: 'securePassword',
      };

      const response = await request(app.getHttpServer())
        .post('/users/create')
        .send(createUserDto);

      expect(response.body).toMatchObject({
        message: ['email must be an email'],
        error: 'Bad Request',
        statusCode: 400,
      });
    });

    it('shouldnt create a user if email already exists', async () => {
      const createUserDto = {
        email: 'fedorov4991@gmail.com',
        name: 'John',
        surname: 'Doe',
        password: 'securePassword',
      };

      const response = await request(app.getHttpServer())
        .post('/users/create')
        .send(createUserDto);

      expect(response.body).toMatchObject({
        message: 'User already exists',
        error: 'Conflict',
        statusCode: 409,
      });
    });
  });
  describe('/users/verification/{token} (GET)', () => {
    it('should verify new user', async () => {
      const response = await request(app.getHttpServer())
        .get(
          '/users/verification/%242b%2410%24NbzZz5cpF0QVDp7eSMGOuOzReSa2.uhdgk4Lck4bJi8gz7i5KMR3C',
        )
        .send()
        .expect(200);

      expect(response.body).toMatchObject({
        message: 'Email verified successfully',
      });
    });

    it('shouldnt verify new user if token is wrong', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/verification/wrongtoken')
        .send()
        .expect(404);

      expect(response.body).toMatchObject({
        message: 'User or task not found',
        error: 'Not Found',
        statusCode: 404,
      });
    });
  });

  describe('/users/login (POST )', () => {
    it('should login user', async () => {
      await request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: 'string@gmail.com',
          password: 'string',
        })
        .expect(200);
    });

    it('shouldnt login user if login is wrong', async () => {
      await request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: 'wrong@gmail.com',
          password: 'string',
        })
        .expect(401);
    });

    it('shouldnt login user if password is wrong', async () => {
      await request(app.getHttpServer())
        .post('/users/login')
        .send({
          email: 'string@gmail.com',
          password: 'wrong',
        })
        .expect(401);
    });
  });

  describe('/users/reset-password/{token} (GET)', () => {
    it('should reset password', async () => {
      await request(app.getHttpServer())
        .get(
          '/users/reset-password/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoicmVzZXRfcGFzc3dvcmRfdG9rZW4iLCJzdWIiOnsiZW1haWwiOiJmZWRvcm92NDk5MUBnbWFpbC5jb20iLCJuZXdQYXNzd29yZCI6ImZlZG9yb3Y0OTkxQGdtYWlsLmNvbSJ9LCJpYXQiOjE3MDM1MDE0MTh9.uNmGAY6UKomjRT5qdYOhA2UZl3p6LxehjDo9UMEp4sQ',
        )
        .send()
        .expect(200);
    });

    it('shouldnt reset password if token is wrong', async () => {
      await request(app.getHttpServer())
        .get('/users/reset-password/wrong-token')
        .send()
        .expect(401);
    });
  });

  describe('/users/profile (GET)', () => {
    it('should get users profile', async () => {
      const response = await request(app.getHttpServer())
        .get('/users/profile')
        .set('userId', '34')
        .send()
        .expect(200);

      expect(response.body).toMatchObject({
        name: 'string',
        surname: 'string',
      });
    });
  });
});
