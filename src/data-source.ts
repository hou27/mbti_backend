import { Test } from '@nestjs/testing';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './users/entities/user.entity';

// export const dataSourceOptions: DataSourceOptions = {
//   type: 'postgres',
//   ...(process.env.DATABASE_URL
//     ? { url: process.env.DATABASE_URL }
//     : {
//         host: process.env.DB_HOST,
//         port: +process.env.DB_PORT,
//         username: process.env.DB_USERNAME,
//         password: process.env.DB_PW,
//         database: process.env.DB_NAME,
//       }),
//   synchronize: /*process.env.NODE_ENV !== 'prod'*/ true,
//   logging: process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test',
//   entities: [User, Test],
//   /* Add SSL option */
//   ssl: {
//     rejectUnauthorized: false,
//   },
// };

// class postgresLocalConfig {
//   private readonly type: string = 'postgres';
//   private readonly host: string = process.env.DB_HOST;
//   private readonly port: number = +process.env.DB_PORT;
//   private readonly username: string = process.env.DB_USERNAME;
//   private readonly password: string = process.env.DB_PW;
//   private readonly database: string = process.env.DB_NAME;
//   private readonly synchronize: boolean = true;
//   private readonly logging: boolean =
//     process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test';
//   private readonly entities: any[] = [User, Test];
//   private readonly ssl: { rejectUnauthorized: boolean } = {
//     rejectUnauthorized: false,
//   };

//   get getConfig() {
//     return this;
//   }
// }

// class postgresHerokuConfig {
//   private readonly type: string = 'postgres';
//   private readonly url: string = process.env.DATABASE_URL;
//   private readonly synchronize: boolean = true;
//   private readonly logging: boolean =
//     process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test';
//   private readonly entities: any[] = [User, Test];
//   private readonly ssl: { rejectUnauthorized: boolean } = {
//     rejectUnauthorized: false,
//   };

//   get getConfig() {
//     return this;
//   }
// }

// class Database {
//   constructor(
//     private readonly config: postgresLocalConfig | postgresHerokuConfig,
//   ) {}

//   public get getDataSourceOptions() {
//     return this.config.getConfig;
//   }
// }

// export const DatabaseOptions = new Database(
//   process.env.DATABASE_URL
//     ? new postgresHerokuConfig()
//     : new postgresLocalConfig(),
// );
