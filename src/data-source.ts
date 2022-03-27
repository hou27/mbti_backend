import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  ...(process.env.DATABASE_URL
    ? { url: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PW,
        database: process.env.DB_NAME,
      }),
  synchronize: /*process.env.NODE_ENV !== 'prod'*/ true,
  logging: process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test',
  entities: [User, Test],
  /* Add SSL option */
  ssl: {
    rejectUnauthorized: false,
  },
});
