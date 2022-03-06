import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UserService } from './users.service';

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly usersService: UserService) {}

  // @Mutation((returns) => CreateAccountOutput)
  // async createAccount(
  //   @Args('input') createAccountInput: CreateAccountInput,
  // ): Promise<CreateAccountOutput> {
  //   return this.usersService.createAccount(createAccountInput);
  // }

  @Query((returns) => Boolean)
  rootQuery(): Boolean {
    return true;
  }
  // @Mutation((returns) => LoginOutput)
  // async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
  //   return this.usersService.login(loginInput);
  // }

  // @Query((returns) => User)
  // @Role(['Any']) // set metadata
  // me(@AuthUser() authUser: User) {
  //   // decorator has to return value
  //   return authUser;
  // }

  // @Query((returns) => UserProfileOutput)
  // @Role(['Any'])
  // async userProfile(
  //   @Args() userProfileInput: UserProfileInput,
  // ): Promise<UserProfileOutput> {
  //   return this.usersService.findById(userProfileInput.userId);
  // }

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
}
