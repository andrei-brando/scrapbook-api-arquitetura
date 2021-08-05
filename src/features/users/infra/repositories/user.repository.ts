import { User } from "../../../notes/domain";
import { UserEntity } from "../../../notes/infra";

class UserRepository {
  async create(params: User): Promise<User> {
    const { email, password } = params;

    const user = await UserEntity.create({
      email,
      password,
    }).save();

    return user;
  }

  async getOne(uid: string): Promise<User | null> {
    const user = await UserEntity.findOne(uid);

    if (!user) return null;

    return user;
  }

  async getOneByEmail(email: string): Promise<User | null> {
    const user = await UserEntity.findOne({
      where: { email }
    });

    if (!user) return null;

    return user;
  }

  async getAll(): Promise<User[] | null> {
    const users = await UserEntity.find();

    if (!users) return null;

    return users;
  }
}

export { UserRepository }