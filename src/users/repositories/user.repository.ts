import { DeleteResult, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

import * as qs from 'qs';
import axios from 'axios';
import { GetAccessTokenOutput, GetUserInfoOutput } from '../dtos/kakao.dto';
import { CustomRepository } from './custom-repository.decorator';

/**
 * This Repository is Custom repository extends standard Repository
 * You can access any method created inside it and any method
 * in the standard entity repository.
 */

// @EntityRepository(User)
@CustomRepository(User)
export class UserRepository extends Repository<User> {
  // Delete Account by Id
  async deleteAccountById(userId: number): Promise<DeleteResult> {
    const deleteResult = await this.delete(userId);

    return deleteResult;
  }

  // Get access token from Kakao Auth Server
  async getAccessToken(code: string): Promise<GetAccessTokenOutput> {
    try {
      const formData = {
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_REST_API_KEY,
        redirect_uri: process.env.REDIRECT_URI_LOGIN,
        code,
        client_secret: process.env.KAKAO_CLIENT_SECRET,
      };
      const {
        data: { access_token: accessToken },
      } = await axios
        .post(`https://kauth.kakao.com/oauth/token?${qs.stringify(formData)}`)
        .then((res) => {
          return res;
        });

      return { ok: true, accessToken };
    } catch (e) {
      return { ok: false, error: e };
    }
  }

  // Get User Info from Kakao Auth Server
  async getUserInfo(accessToken: String): Promise<GetUserInfoOutput> {
    try {
      const { data: userInfo } = await axios
        .get('https://kapi.kakao.com/v2/user/me', {
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          },
        })
        .then((res) => {
          return res;
        });

      return { ok: true, userInfo };
    } catch (e) {
      return { ok: false, error: e };
    }
  }
}
