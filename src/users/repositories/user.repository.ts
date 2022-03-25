import {
  DeleteResult,
  EntityRepository,
  getConnection,
  Repository,
} from 'typeorm';
import { User } from '../entities/user.entity';

/**
 * The difference between this type of repository and the previous one is that it does not expose all the methods Repository has.
 * AbstractRepository does not have any public methods, it only has protected methods, like manager and repository, which you can use in your own public methods.
 * Extending AbstractRepository is useful if you don't want to expose all methods the standard Repository has to the public.
 */

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async deleteAccountById(userId: number): Promise<DeleteResult> {
    const deleteResult = await getConnection()
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('id = :id', { id: userId })
      .execute();

    return deleteResult;
  }
}
