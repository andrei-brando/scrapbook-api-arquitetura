import { User } from "../../../../../src/core/domain";
import { badRequest, HttpRequest, notFound, ok, serverError } from "../../../../../src/core/presentation";
import { AuthRepository } from "../../../../../src/features/authentication/infra";
import { AuthController } from "../../../../../src/features/authentication/presentation";
import { CacheRepository } from "../../../../../src/features/users/infra";

jest.mock('../../../../../src/features/authentication/infra/repositories/auth.repository.ts');
jest.mock('../../../../../src/core/infra/repositories/cache.repository.ts');

const makeResult = (): any => ({
  message: 'Usuário encontrado, você será redirecionado para o sistema',
  uid: 'any_uid',
});

const makeResultUser = (): User => ({
  uid: 'any_uid',
  email: 'any_email',
  password: 'any_password',
});

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

const makeSut = (): AuthController => {
  return new AuthController(
    new AuthRepository(),
    new CacheRepository(),
  );
}

describe('USER CONTROLLER', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('STORE', () => {
    test('should return code 200 when valid data is provided', async () => {
      jest.spyOn(AuthRepository.prototype, 'signIn')
        .mockResolvedValue(makeResultUser());

      const sut = makeSut();
      const result = await sut.store(makeRequestStore());

      expect(result).toEqual(ok(makeResult()));
    });

    test('should return code 404 when user already exists', async () => {
      jest.spyOn(AuthRepository.prototype, 'signIn')
        .mockResolvedValue(null);

      const sut = makeSut();
      const result = await sut.store(makeRequestStore());

      expect(result).toEqual(notFound());
    });

    test('should return code 500 when throw any exception', async () => {
      jest.spyOn(AuthRepository.prototype, 'signIn')
        .mockRejectedValue(new Error());

      const sut = makeSut();
      const result = await sut.store(makeRequestStore());

      expect(result).toEqual(serverError());
    });
  });
});