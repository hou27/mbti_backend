import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
import {
  CreateAccountInput,
  CreateAccountOutput,
  CreateKakaoAccountInput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import {
  SearchUserByNameInput,
  SearchUserByNameOutput,
  UserProfileOutput,
} from './dtos/user-profile.dto';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { FindByEmailInput } from './dtos/me.dto';
import { Test } from 'src/test/entities/test.entity';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly jwtService: JwtService,
    @InjectRepository(Test)
    private readonly tests: Repository<Test>,
  ) {}

  async createAccount({
    name,
    email,
    gender,
    password,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const exists = await this.users.findOne(
        { email },
        {
          relations: ['myResult', 'userList'],
        },
      );
      if (exists) {
        return { ok: false, error: 'There is a user with that email already' };
      }
      const user = await this.users.save(
        this.users.create({ name, email, gender, password }),
      );

      // const verification = await this.verifications.save(
      //   this.verifications.create({ user }),
      // );

      // this.mailService.sendVerificationEmail(user.email, verification.code);

      return { ok: true };
    } catch (e) {
      console.log(e);
      return { ok: false, error: "Couldn't create account" };
    }
  }

  async createKakaoAccount({
    name,
    profileImg,
    email,
    gender,
    password,
    birth,
  }: CreateKakaoAccountInput): Promise<CreateAccountOutput> {
    try {
      if (!name || !email || gender === undefined || !password) {
        return { ok: false, error: "Couldn't create account with less args" };
      }
      const exists = await this.users.findOne(
        { email },
        {
          relations: ['myResult', 'userList'],
        },
      );
      if (exists) {
        return { ok: false, error: 'There is a user with that email already' };
      }
      const user = await this.users.save(
        this.users.create({
          name,
          profileImg,
          email,
          gender,
          password,
          birth,
          verified: true,
        }),
      );

      // const verification = await this.verifications.save(
      //   this.verifications.create({ user }),
      // );

      // this.mailService.sendVerificationEmail(user.email, verification.code);

      return { ok: true };
    } catch (e) {
      console.log(e);
      return { ok: false, error: "Couldn't create account" };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    // make a JWT and give it to the user
    try {
      const user = await this.users.findOne(
        { email },
        { select: ['id', 'password'] },
        // tell findOne that I want to select things(load from db)

        // select 하기 전엔 전부 불러와지지만(select: false인 Column제외)
        // pw를 불러오기 위해 select해주면 select한 것만 불러와짐.
      );
      console.log(user);
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Wrong password',
        };
      }
      const token = this.jwtService.sign(
        user.id,
        /*{ id: user.id }*/
      );
      // const token = jwt.sign(
      // 	{ id: user.id },
      // 	this.config.get('SECRET_KEY') /* process.env.SECRET_KEY */
      // );
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error: "Can't log user in.",
      };
    }
  }

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOneOrFail(
        { id },
        {
          relations: ['myResult', 'userList'],
        },
      ); // findOneOrFail throw an Error.
      console.log(user.myResult[1]);
      const myResult: Test[] = [];
      const userList: Test[] = [];

      for (let i = 0; i < user.myResult.length; i++) {
        myResult.push(
          await this.tests.findOne(user.myResult[i].id, {
            relations: ['tester'],
          }),
        );
      }
      for (let i = 0; i < user.userList.length; i++) {
        userList.push(
          await this.tests.findOne(user.userList[i].id, {
            relations: ['user'],
          }),
        );
      }

      return {
        ok: true,
        user: user,
        myResult,
        userList,
      };
    } catch (error) {
      return { ok: false, error: 'User Not Found' };
    }
  }

  async findByEmail({ email }: FindByEmailInput): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOne({ email });
      if (!user) {
        return { ok: false, error: 'There is no user with that email' };
      }
      return {
        ok: true,
        user: user,
      };
    } catch (error) {
      return { ok: false, error: 'User Not Found' };
    }
  }

  async searchUserByName({
    name,
  }: SearchUserByNameInput): Promise<SearchUserByNameOutput> {
    try {
      const users = await this.users.find({
        where: {
          name: ILike(`%${name}%`), // Raw(name => `${name} ILIKE '%${query}%'`),
        },
        relations: ['myResult', 'userList'],
      });
      return {
        ok: true,
        users,
      };
    } catch {
      return { ok: false, error: 'Could not search for users' };
    }
  }

  async editProfile(
    userId: number,
    { email, password, oldPassword, birth, bio, name }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    // return this.users.update(userId, { ...editProfileInput });
    // TypeORM - update : Doesn't check if entity exist in the db.
    // --------- just send a query to db. (update entity X)
    // -> can't call BeforeUpdate Hook.

    // resolve -> use save().
    try {
      const user = await this.users.findOne(userId);
      if (email) {
        user.email = email;
      }
      if (name) {
        user.name = name;
      }
      if (password && oldPassword) {
        if (oldPassword === user.password) user.password = password;
        else return { ok: false, error: 'The password is incorrect' };
      }
      if (birth) {
        user.birth = birth;
      }
      if (bio) {
        user.bio = bio;
      }
      await this.users.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return { ok: false, error: 'Could not update profile.' };
    }
  }

  // async verifyEmail(code: string): Promise<VerifyEmailOutput> {
  //   try {
  //     const verification = await this.verifications.findOneOrFail(
  //       { code },
  //       { relations: ['user'] },
  //     );
  //     verification.user.verified = true;
  //     this.users.save(verification.user); // verify
  //     await this.verifications.delete(verification.id); // delete verification value

  //     return { ok: true };
  //   } catch (error) {
  //     return { ok: false, error: 'Could not verify email.' };
  //   }
  // }
}
