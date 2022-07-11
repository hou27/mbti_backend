import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';

// https://github.com/DIY0R/tacca/blob/main/src/database/DataBase.ts
// export interface PostgresqlConfigInterface {
//   type: string;
//   host: string;
//   port: number;
//   username: string;
//   password: string;
//   database: string;
//   synchronize: boolean;
//   logging: boolean;
// }

// class PostgresqlConfigDeploy {
//   private readonly type = 'postgres';
//   private readonly host = process.env.HOST;
//   private readonly port = process.env.PORT_HOST;
//   private readonly username = process.env.USER;
//   private readonly password = process.env.PASSWORD;
//   private readonly database = process.env.DATABASE;
//   private readonly synchronize = true;
//   private readonly logging = true;
//   get getConfig() {
//     return this;
//   }
// }

// class Database {
//   constructor(private readonly database: PostgresqlConfigDeploy) {}
//   public get getDataBaseConfig(): object {
//     return this.database.getConfig;
//   }
// }
// export const DatabaseConfig = new Database(new PostgresqlConfigDeploy());

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
