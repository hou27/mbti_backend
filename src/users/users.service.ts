import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from './entities/user.entity';
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
import axios from 'axios';

import * as qs from 'qs';
import * as CryptoJS from 'crypto-js';
import {
  DeleteAccountInput,
  DeleteAccountOutput,
} from './dtos/delete-account.dto';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly users: /*Repository<User>*/ UserRepository,
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

  async deleteAccount({
    userId,
  }: DeleteAccountInput): Promise<DeleteAccountOutput> {
    try {
      const { affected } = await this.users.deleteAccountById(userId);

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
      // get access token
      const formData = {
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_REST_API_KEY,
        redirect_uri: process.env.REDIRECT_URI_LOGIN,
        code,
        client_secret: process.env.KAKAO_CLIENT_SECRET,
      };
      const {
        data: { access_token },
      } = await axios
        .post(`https://kauth.kakao.com/oauth/token?${qs.stringify(formData)}`)
        .then((res) => {
          return res;
        });

      // get user info
      const { data: userInfo } = await axios
        .get('https://kapi.kakao.com/v2/user/me', {
          headers: {
            Authorization: 'Bearer ' + access_token,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        })
        .then((res) => {
          return res;
        });

      const name = userInfo.properties.nickname;
      const profileImg = userInfo.properties.profile_image;
      const email = userInfo.kakao_account.email;
      const gender = userInfo.kakao_account.gender;
      const birth = userInfo.kakao_account.birthday;

      const password = CryptoJS.SHA256(email + birth).toString();
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
      return { ok: false, error: 'Please Refresh and Try One more time' };
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
      return { ok: false, error: 'User Not Found while find by id' };
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
