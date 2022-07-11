import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import {
  SearchUserByNameInput,
  SearchUserByNameOutput,
  UserProfileOutput,
  FindByEmailInput,
} from './dtos/user-profile.dto';
import { Test } from 'src/test/entities/test.entity';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { LoginWithKakaoInput } from './dtos/kakao.dto';
import * as CryptoJS from 'crypto-js';
import { DeleteAccountOutput } from './dtos/delete-account.dto';
import { UserRepository } from './repositories/user.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly users: UserRepository,
    private readonly jwtService: JwtService,
    @InjectRepository(Test)
    private readonly tests: Repository<Test>,
  ) {}

  async createAccount({
    name,
    email,
    gender,
    password,
    profileImg,
    birth,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      const exists = await this.users.findOne({
        where: { email },
        relations: {
          myResult: true,
          userList: true,
        },
      });
      if (exists) {
        return { ok: false, error: 'There is a user with that email already' };
      }
      const user = await this.users.save(
        this.users.create({ name, email, gender, password, profileImg, birth }),
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

  async deleteAccount(userId: number): Promise<DeleteAccountOutput> {
    try {
      const { affected } = await this.users.delete(userId);

      if (affected === 1) {
        return { ok: true };
      }
      return { ok: false, error: 'Failed on delete account' };
    } catch (e) {
      console.log(e);
      return { ok: false, error: "Couldn't delete account" };
    }
  }

  async loginWithKakao({ code }: LoginWithKakaoInput): Promise<LoginOutput> {
    try {
      const { accessToken, error: accessTokenError } =
        await this.users.getAccessToken(code);
      if (accessTokenError) {
        console.log(accessTokenError);
        return { ok: false, error: 'Please go back and Try again' };
      }

      const { userInfo, error: userInfoError } = await this.users.getUserInfo(
        accessToken,
      );
      if (userInfoError) {
        console.log(userInfoError);
        return { ok: false, error: 'Please go back and Try again' };
      }

      const name = userInfo.properties.nickname;
      const profileImg = userInfo.properties.profile_image;
      const email = userInfo.kakao_account.email;
      const gender = userInfo.kakao_account.gender;
      const birth = userInfo.kakao_account.birthday;

      const password = CryptoJS.SHA256(
        email + birth + process.env.KAKAO_JS_KEY,
      ).toString();
      let intGender = gender === 'male' ? 0 : 1;

      // check user exist with email
      const { ok: user } = await this.findByEmail({ email });

      // control user
      let createAccountResult;
      if (!user) {
        const { ok } = await this.createAccount({
          name,
          email,
          gender: +intGender,
          password,
          profileImg,
          birth,
        });
        createAccountResult = ok;
      }

      if (user || createAccountResult) {
        return await this.login({ email, password });
      } else {
        return { ok: false, error: "Couldn't create account in try" };
      }
    } catch (e) {
      console.log(e);
      return { ok: false, error: 'INTERNAL_SERVER_ERROR' };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    // make a JWT and give it to the user
    try {
      const user = await this.users.findOne(
        { where: { email }, select: { id: true, password: true } },
        // tell findOne that I want to select things(load from db)

        // select 하기 전엔 전부 불러와지지만(select: false인 Column제외)
        // pw를 불러오기 위해 select해주면 select한 것만 불러와짐.
      );

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
      const user = await this.users.findOneOrFail({
        where: { id },

        relations: {
          myResult: true,
          userList: true,
        },
      }); // findOneOrFail throw an Error.
      console.log(user.myResult[1]);
      const myResult: Test[] = [];
      const userList: Test[] = [];

      for (let i = 0; i < user.myResult.length; i++) {
        myResult.push(
          await this.tests.findOne({
            where: {
              id: user.myResult[i].id,
            },
            relations: { tester: true },
          }),
        );
      }
      for (let i = 0; i < user.userList.length; i++) {
        userList.push(
          await this.tests.findOne({
            where: {
              id: user.userList[i].id,
            },
            relations: { user: true },
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
      return { ok: false, error: 'User Not Found while find by id' };
    }
  }

  async findByEmail({ email }: FindByEmailInput): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOneBy({ email });
      if (!user) {
        return { ok: false, error: 'There is no user with that email' };
      }
      return {
        ok: true,
        user: user,
      };
    } catch (error) {
      return { ok: false, error: 'User Not Found while find by email' };
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
      const user = await this.users.findOneBy({ id: userId });
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
