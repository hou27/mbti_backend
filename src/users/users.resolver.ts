import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { GqlAuthGuard } from 'src/auth/auth.guard';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { DeleteAccountOutput } from './dtos/delete-account.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { LoginWithKakaoInput } from './dtos/kakao.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import {
  RefreshTokenInput,
  RefreshTokenOutput,
} from './dtos/refresh-token.dto';
import {
  SearchUserByNameInput,
  SearchUserByNameOutput,
  UserProfileOutput,
  FindByEmailInput,
  FindByIdInput,
} from './dtos/user-profile.dto';
import { User } from './entities/user.entity';
import { UserService } from './users.service';

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly usersService: UserService) {}

  @Query((returns) => User)
  @UseGuards(GqlAuthGuard)
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
  async deleteAccount(
    @AuthUser() authUser: User,
  ): Promise<DeleteAccountOutput> {
    return this.usersService.deleteAccount(authUser.id);
  }

  @Mutation((returns) => LoginOutput)
  async loginWithKakao(
    @Args('input') loginWithKakaoInput: LoginWithKakaoInput,
  ): Promise<LoginOutput> {
    return this.usersService.loginWithKakao(loginWithKakaoInput);
  }

  @Mutation((returns) => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  @Mutation((returns) => RefreshTokenOutput)
  async refreshToken(
    @Args('input') refreshTokenInput: RefreshTokenInput,
  ): Promise<RefreshTokenOutput> {
    return this.usersService.regenerateAccessToken(refreshTokenInput);
  }

  @Query((returns) => UserProfileOutput)
  async userProfile(
    @Args() findByIdInput: FindByIdInput,
  ): Promise<UserProfileOutput> {
    return this.usersService.findById(findByIdInput.userId);
  }

  @Mutation((returns) => EditProfileOutput)
  @UseGuards(GqlAuthGuard)
  async editProfile(
    @AuthUser() authUser: User,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    return this.usersService.editProfile(authUser.id, editProfileInput);
  }

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
