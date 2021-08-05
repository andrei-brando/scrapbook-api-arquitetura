import { User } from "../../../notes/domain";
import { UserEntity } from "../../../notes/infra";

class AuthRepository {
  async signIn(params: User): Promise<User | null> {
    const { email, password } = params;

    const user = await UserEntity.findOne({
      where: { email, password }
    });

    if (!user) return null;

    return user;
  }
}

export { AuthRepository }