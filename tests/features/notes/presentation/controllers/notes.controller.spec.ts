import { Note } from "../../../../../src/features/notes/domain/models";
import { CacheRepository, NoteRepository } from "../../../../../src/features/notes/infra";
import { HttpRequest, NoteController, notFound, ok, serverError } from "../../../../../src/features/notes/presentation";

jest.mock('../../../../../src/features/notes/infra/repositories/note.repository.ts');
jest.mock('../../../../../src/core/infra/repositories/cache.repository.ts');

const makeResult = (): Note => {
  return {
    uid: 'any_uid',
    description: 'any_description',
    details: 'any_details',
    userUid: 'any_uid',
  }
}

const makeRequestBody = (): HttpRequest => {
  return {
    body: {
      description: 'any_description',
      details: 'any_details',
      userUid: 'any_uid',
    },
    params: {}
  }
}

const makeRequestParams = (): HttpRequest => {
  return {
    body: {},
    params: {
      userUid: 'any_uid',
    }
  }
}

const makeSut = (): NoteController => {
  return new NoteController(
    new NoteRepository(),
    new CacheRepository(),
  );
}

describe('NOTES CONTROLLER', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('INDEX', () => {
    test('should return code 500 when throw any exception', async () => {
      jest.spyOn(CacheRepository.prototype, 'get')
        .mockResolvedValue(null);
      jest.spyOn(NoteRepository.prototype, 'getAll')
        .mockRejectedValue(new Error());

      const sut = makeSut();
      const result = await sut.index(makeRequestParams());

      expect(result).toEqual(serverError());
    });

    test('should return code 200 when get notes on cache', async () => {
      jest.spyOn(CacheRepository.prototype, 'get')
        .mockResolvedValue([makeResult]);

      const sut = makeSut();
      const result = await sut.index(makeRequestParams());

      expect(result).toEqual(ok([makeResult]));
    });

    test('should return code 404 when not exists notes', async () => {
      jest.spyOn(CacheRepository.prototype, 'get')
        .mockResolvedValue(null);
      jest.spyOn(NoteRepository.prototype, 'getAll')
        .mockResolvedValue([]);

      const sut = makeSut();
      const result = await sut.index(makeRequestParams());

      expect(result).toEqual(notFound());
    });

    test('should call and set cache repository', async () => {
      jest.spyOn(CacheRepository.prototype, 'get')
        .mockResolvedValue(null);
      jest.spyOn(NoteRepository.prototype, 'getAll')
        .mockResolvedValue([makeResult()]);

      const setSpy = jest.spyOn(CacheRepository.prototype, 'set')
        .mockResolvedValue(null);

      const sut = makeSut();
      const result = await sut.index(makeRequestParams());

      expect(setSpy).toHaveBeenCalledWith(`notes:all:user:any_uid`, [makeResult()]);
      expect(result).toEqual(ok([makeResult()]))
    });
  });

  describe('SHOW', () => {
    test('should return code 500 when throw any exception', async () => {
      jest.spyOn(CacheRepository.prototype, 'get')
        .mockResolvedValue(null);
      jest.spyOn(NoteRepository.prototype, 'getOne')
        .mockRejectedValue(new Error());

      const sut = makeSut();
      const result = await sut.show(makeRequestParams());

      expect(result).toEqual(serverError());
    });

    test('should return code 200 when get note on cache', async () => {
      jest.spyOn(CacheRepository.prototype, 'get')
        .mockResolvedValue(makeResult());

      const sut = makeSut();
      const result = await sut.show(makeRequestParams());

      expect(result).toEqual(ok(makeResult()));
    });
  });

  describe('STORE', () => {
    test('should return code 200 when valid data is provided', async () => {
      jest.spyOn(NoteRepository.prototype, 'create')
        .mockResolvedValue(makeResult());

      const sut = makeSut();
      const result = await sut.store(makeRequestBody());

      expect(result).toEqual(ok(makeResult()));
    });

    test('should return code 500 when throw any exception', async () => {
      jest.spyOn(NoteRepository.prototype, 'create')
        .mockRejectedValue(new Error());

      const sut = makeSut();
      const result = await sut.store(makeRequestBody());

      expect(result).toEqual(serverError());
    });
  });
});