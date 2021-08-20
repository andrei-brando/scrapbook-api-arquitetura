import { User } from "../../../../../src/core/domain";
import { badRequest, HttpRequest, ok, serverError, UserAlreadyExistsError } from "../../../../../src/core/presentation";
import { CacheRepository, UserRepository } from "../../../../../src/features/users/infra";
import { UserController } from "../../../../../src/features/users/presentation";

jest.mock('../../../../../src/features/users/infra/repositories/user.repository.ts');
jest.mock('../../../../../src/core/infra/repositories/cache.repository.ts');

const makeResult = (): User => ({
  uid: 'any_uid',
  email: 'any_email',
  password: 'any_password',
});

const makeResultError = (): UserAlreadyExistsError => new UserAlreadyExistsError();

const makeRequestStore = (): HttpRequest => ({
  body: {
    email: 'any_email',
    password: 'any_password',
  },
  params: {}
});

const makeGenericRequest = (): HttpRequest => ({
  body: {},
  params: {}
});

const makeSut = (): UserController => {
  return new UserController(
    new UserRepository(),
    new CacheRepository(),
  );
}

describe('USER CONTROLLER', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('STORE', () => {
    test('should return code 200 when valid data is provided', async () => {
      jest.spyOn(UserRepository.prototype, 'create')
        .mockResolvedValue(makeResult());

      const sut = makeSut();
      const result = await sut.store(makeRequestStore());

      expect(result).toEqual(ok(makeResult()));
    });

    test('should return code 404 when user already exists', async () => {
      jest.spyOn(UserRepository.prototype, 'getOneByEmail')
        .mockResolvedValue(makeResult());

      const sut = makeSut();
      const result = await sut.store(makeRequestStore());

      expect(result).toEqual(badRequest(makeResultError()));
    });

    test('should return code 500 when throw any exception', async () => {
      jest.spyOn(UserRepository.prototype, 'getOneByEmail')
        .mockResolvedValue(null);
      jest.spyOn(UserRepository.prototype, 'create')
        .mockRejectedValue(new Error());

      const sut = makeSut();
      const result = await sut.store(makeRequestStore());

      expect(result).toEqual(serverError());
    });
  });
});