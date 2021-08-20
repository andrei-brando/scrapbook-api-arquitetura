import { User } from "../../../../../src/core/domain";
import { UserEntity } from "../../../../../src/core/infra";
import Database from "../../../../../src/core/infra/data/connections/database";
import { AuthRepository } from "../../../../../src/features/authentication/infra";

jest.mock('../../../../../src/features/authentication/infra/repositories/auth.repository.ts');

const makeUser = async (): Promise<UserEntity> => {
  return UserEntity.create({
    email: 'any_email',
    password: 'any_password'
  }).save();
}

const makeResultUser = (): User => ({
  uid: 'any_uid',
  email: 'any_email',
  password: 'any_password',
});

describe('Authentication Repository', () => {
  beforeAll(async () => {
    await new Database().openConnection();
  });

  beforeEach(async () => {
    await UserEntity.clear();
  });

  afterAll(async () => {
    await new Database().disconnectDatabase();
  });

  describe('SIGN IN', () => {
    test('should find a user', async () => {
      const fakeUser = await makeUser();

      jest.spyOn(AuthRepository.prototype, 'signIn')
        .mockResolvedValue(makeResultUser());

      const sut = new AuthRepository();
      const result = await sut.signIn(fakeUser);

      expect(result).toEqual(makeResultUser());
    })
  });
});