import { Note } from "../../../../../src/features/notes/domain/models";
import { CacheRepository, NoteRepository } from "../../../../../src/features/notes/infra";
import { HttpRequest, NoteController, notFound, ok, serverError } from "../../../../../src/features/notes/presentation";

jest.mock('../../../../../src/features/notes/infra/repositories/note.repository.ts');
jest.mock('../../../../../src/core/infra/repositories/cache.repository.ts');

const makeResult = (): Note => ({
  uid: 'any_uid',
  description: 'any_description',
  details: 'any_details',
  userUid: 'any_uid',
});

const makeRequestStore = (): HttpRequest => ({
  body: {
    description: 'any_description',
    details: 'any_details',
    userUid: 'any_uid',
  },
  params: {}
});

const makeRequestIndex = (): HttpRequest => ({
  body: {},
  params: {
    userUid: 'any_uid',
  }
});

const makeRequestShow = (): HttpRequest => ({
  body: {},
  params: {
    uid: 'any_uid',
  }
});

const makeRequestDelete = (): HttpRequest => ({
  body: {},
  params: {
    uid: 'any_uid',
  }
});

const makeRequestUpdate = (): HttpRequest => ({
  body: {
    description: 'any_description',
    details: 'any_details',
  },
  params: {
    uid: 'any_uid',
  }
});

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
      const result = await sut.index(makeRequestIndex());

      expect(result).toEqual(serverError());
    });

    test('should return code 200 when get notes on cache', async () => {
      jest.spyOn(CacheRepository.prototype, 'get')
        .mockResolvedValue([makeResult]);

      const sut = makeSut();
      const result = await sut.index(makeRequestIndex());

      expect(result).toEqual(ok([makeResult]));
    });

    test('should return code 404 when not exists notes', async () => {
      jest.spyOn(CacheRepository.prototype, 'get')
        .mockResolvedValue(null);
      jest.spyOn(NoteRepository.prototype, 'getAll')
        .mockResolvedValue([]);

      const sut = makeSut();
      const result = await sut.index(makeRequestIndex());

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
      const result = await sut.index(makeRequestIndex());

      expect(setSpy).toHaveBeenCalledWith(`notes:all:user:any_uid`, [makeResult()]);
      expect(result).toEqual(ok([makeResult()]))
    });
  });

  describe('SHOW', () => {
    test('should return code 404 when not find note on repository', async () => {
      jest.spyOn(CacheRepository.prototype, 'get')
        .mockResolvedValue(null);
      jest.spyOn(NoteRepository.prototype, 'getOne')
        .mockResolvedValue(null);

      const sut = makeSut();
      const result = await sut.show(makeRequestShow());

      expect(result).toEqual(notFound());
    });

    test('should return code 200 when get note on cache', async () => {
      jest.spyOn(CacheRepository.prototype, 'get')
        .mockResolvedValue(null);
      jest.spyOn(NoteRepository.prototype, 'getOne')
        .mockResolvedValue(makeResult());

      const setSpy = jest.spyOn(CacheRepository.prototype, 'set')
        .mockResolvedValue(null);

      const sut = makeSut();
      const result = await sut.show(makeRequestShow());

      expect(result).toEqual(ok(makeResult()));
      expect(setSpy).toHaveBeenCalledWith(`notes:any_uid`, makeResult());
    });


    test('should return code 500 when throw any exception', async () => {
      jest.spyOn(CacheRepository.prototype, 'get')
        .mockResolvedValue(null);
      jest.spyOn(NoteRepository.prototype, 'getOne')
        .mockRejectedValue(new Error());

      const sut = makeSut();
      const result = await sut.show(makeRequestIndex());

      expect(result).toEqual(serverError());
    });

    test('should return code 200 when get note on cache', async () => {
      jest.spyOn(CacheRepository.prototype, 'get')
        .mockResolvedValue(makeResult());

      const sut = makeSut();
      const result = await sut.show(makeRequestIndex());

      expect(result).toEqual(ok(makeResult()));
    });
  });

  describe('STORE', () => {
    test('should return code 200 when valid data is provided', async () => {
      jest.spyOn(NoteRepository.prototype, 'create')
        .mockResolvedValue(makeResult());

      const sut = makeSut();
      const result = await sut.store(makeRequestStore());

      expect(result).toEqual(ok(makeResult()));
    });

    test('should return code 500 when throw any exception', async () => {
      jest.spyOn(NoteRepository.prototype, 'create')
        .mockRejectedValue(new Error());

      const sut = makeSut();
      const result = await sut.store(makeRequestStore());

      expect(result).toEqual(serverError());
    });
  });

  describe('UPDATE', () => {
    test('should return code 404 when not find note to update on repository', async () => {
      jest.spyOn(NoteRepository.prototype, 'getOne')
        .mockResolvedValue(null);

      const sut = makeSut();
      const result = await sut.update(makeRequestUpdate());

      expect(result).toEqual(notFound());
    });

    test('should call 2 delete cache', async () => {
      jest.spyOn(NoteRepository.prototype, 'getOne')
        .mockResolvedValue(makeResult());

      const deleteSpy = jest.spyOn(CacheRepository.prototype, 'delete')
        .mockResolvedValue(true);

      const deleteAllSpy = jest.spyOn(CacheRepository.prototype, 'delete')
        .mockResolvedValue(true);

      const sut = makeSut();
      const result = await sut.update(makeRequestUpdate());

      expect(result).toEqual(ok(null));
      expect(deleteSpy).toHaveBeenCalledWith(`notes:any_uid`);
      expect(deleteAllSpy).toHaveBeenCalledWith(`notes:all:user:any_uid`);
    });

    test('should return code 500 when throw any exception', async () => {
      jest.spyOn(NoteRepository.prototype, 'update')
        .mockRejectedValue(new Error());

      const sut = makeSut();
      const result = await sut.update(makeRequestUpdate());

      expect(result).toEqual(serverError());
    });
  });

  describe('DELETE', () => {
    test('should return code 404 when not find note to update on repository', async () => {
      jest.spyOn(NoteRepository.prototype, 'getOne')
        .mockResolvedValue(null);

      const sut = makeSut();
      const result = await sut.delete(makeRequestDelete());

      expect(result).toEqual(notFound());
    });

    test('should call 2 delete cache', async () => {
      jest.spyOn(NoteRepository.prototype, 'getOne')
        .mockResolvedValue(makeResult());

      const deleteSpy = jest.spyOn(CacheRepository.prototype, 'delete')
        .mockResolvedValue(true);

      const deleteAllSpy = jest.spyOn(CacheRepository.prototype, 'delete')
        .mockResolvedValue(true);

      const sut = makeSut();
      const result = await sut.delete(makeRequestDelete());

      expect(deleteSpy).toHaveBeenCalledWith(`notes:any_uid`);
      expect(deleteAllSpy).toHaveBeenCalledWith(`notes:all:user:any_uid`);
    });

    test('should return code 200 when delete note', async () => {
      jest.spyOn(NoteRepository.prototype, 'getOne')
        .mockResolvedValue(makeResult());

      const sut = makeSut();
      const result = await sut.delete(makeRequestDelete());

      expect(result).toEqual(ok(null));
    });

    test('should return code 500 when throw any exception', async () => {
      jest.spyOn(NoteRepository.prototype, 'delete')
        .mockRejectedValue(new Error());

      const sut = makeSut();
      const result = await sut.delete(makeRequestDelete());

      expect(result).toEqual(serverError());
    });
  });
});