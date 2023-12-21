import 'dotenv/config';

export const jwtСonfig = {
  secret: process.env.JWT_SECRET_STRING,
  global: true,
  signOptions: { expiresIn: '660s' },
};
