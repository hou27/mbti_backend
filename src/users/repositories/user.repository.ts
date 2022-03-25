import {
  DeleteResult,
  EntityRepository,
  getConnection,
  Repository,
} from 'typeorm';
import { User } from '../entities/user.entity';

/**
 * This Repository is Custom repository extends standard Repository
 * You can access any method created inside it and any method
 * in the standard entity repository.
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
