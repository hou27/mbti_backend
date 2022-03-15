import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { CoreOutput } from 'src/common/dtos/output.dto';
import {
  CreateAccountInput,
  CreateAccountOutput,
  CreateKakaoAccountInput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { FindByEmailInput, meOutput } from './dtos/me.dto';
import {
  SearchUserByNameInput,
  SearchUserByNameOutput,
  UserProfileInput,
  UserProfileOutput,
} from './dtos/user-profile.dto';
import { User } from './entities/user.entity';
import { UserService } from './users.service';

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly usersService: UserService) {}

  @Query((returns) => User)
  @UseGuards(AuthGuard)
  me(@AuthUser() authUser: User) {
    // decorator has to return value
    return authUser;
  }

  @Query((returns) => UserProfileOutput)
  async findByEmail(
    @Args('input') findByEmailInput: FindByEmailInput,
  ): Promise<UserProfileOutput> {
    return this.usersService.findByEmail(findByEmailInput);
  }

  @Mutation((returns) => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.usersService.createAccount(createAccountInput);
  }

  @Mutation((returns) => CreateAccountOutput)
  async createKakaoAccount(
    @Args('input') createKakaoAccount: CreateKakaoAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.usersService.createKakaoAccount(createKakaoAccount);
  }

  @Mutation((returns) => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  @Query((returns) => UserProfileOutput)
  async userProfile(
    @Args() userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    return this.usersService.findById(userProfileInput.userId);
  }

  // @Mutation((returns) => EditProfileOutput)
  // @Role(['Any'])
  // async editProfile(
  //   @AuthUser() authUser: User,
  //   @Args('input') editProfileInput: EditProfileInput,
  // ): Promise<EditProfileOutput> {
  //   return this.usersService.editProfile(authUser.id, editProfileInput);
  // }

  // @Mutation((returns) => VerifyEmailOutput)
  // verifyEmail(
  //   @Args('input') { code }: VerifyEmailInput,
  // ): Promise<VerifyEmailOutput> {
  //   return this.usersService.verifyEmail(code);
  // }

  @Query((returns) => SearchUserByNameOutput)
  searchUser(
    @Args('input') searchUserByNameInput: SearchUserByNameInput,
  ): Promise<SearchUserByNameOutput> {
    return this.usersService.searchUserByName(searchUserByNameInput);
  }
}