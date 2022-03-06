import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // async createAccount({
  //   email,
  //   password,
  // }: CreateAccountInput): Promise<CreateAccountOutput> {
  //   try {
  //     const exists = await this.users.findOne({ email });
  //     if (exists) {
  //       return { ok: false, error: 'There is a user with that email already' };
  //     }
  //     const user = await this.users.save(
  //       this.users.create({ email, password }),
  //     );

  //     const verification = await this.verifications.save(
  //       this.verifications.create({ user }),
  //     );

  //     this.mailService.sendVerificationEmail(user.email, verification.code);

  //     return { ok: true };
  //   } catch (e) {
  //     return { ok: false, error: "Couldn't create account" };
  //   }
  // }

  // async login({ email, password }: LoginInput): Promise<LoginOutput> {
  //   // make a JWT and give it to the user
  //   try {
  //     const user = await this.users.findOne(
  //       { email },
  //       { select: ['id', 'password'] },
  //       // tell findOne that I want to select things(load from db)

  //       // select 하기 전엔 전부 불러와지지만(select: false인 Column제외)
  //       // pw를 불러오기 위해 select해주면 select한 것만 불러와짐.
  //     );
  //     if (!user) {
  //       return {
  //         ok: false,
  //         error: 'User not found',
  //       };
  //     }
  //     const passwordCorrect = await user.checkPassword(password);
  //     if (!passwordCorrect) {
  //       return {
  //         ok: false,
  //         error: 'Wrong password',
  //       };
  //     }
  //     const token = this.jwtService.sign(
  //       user.id,
  //       /*{ id: user.id }*/
  //     );
  //     // const token = jwt.sign(
  //     // 	{ id: user.id },
  //     // 	this.config.get('SECRET_KEY') /* process.env.SECRET_KEY */
  //     // );
  //     return {
  //       ok: true,
  //       token,
  //     };
  //   } catch (error) {
  //     return {
  //       ok: false,
  //       error: "Can't log user in.",
  //     };
  //   }
  // }

  // async editProfile(
  //   userId: number,
  //   { email, password }: EditProfileInput,
  // ): Promise<EditProfileOutput> {
  //   // return this.users.update(userId, { ...editProfileInput });
  //   // TypeORM - update : Doesn't check if entity exist in the db.
  //   // --------- just send a query to db. (update entity X)
  //   // -> can't call BeforeUpdate Hook.

  //   // resolve -> use save().
  //   try {
  //     const user = await this.users.findOne(userId);
  //     if (email) {
  //       user.email = email;
  //       user.verified = false;
  //       await this.verifications.delete({ user: { id: user.id } }); // one user can have only one verification.
  //       const verification = await this.verifications.save(
  //         this.verifications.create({ user }),
  //       );
  //       this.mailService.sendVerificationEmail(user.email, verification.code);
  //     }
  //     if (password) {
  //       user.password = password;
  //     }
  //     await this.users.save(user);
  //     return {
  //       ok: true,
  //     };
  //   } catch (error) {
  //     return { ok: false, error: 'Could not update profile.' };
  //   }
  // }

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
