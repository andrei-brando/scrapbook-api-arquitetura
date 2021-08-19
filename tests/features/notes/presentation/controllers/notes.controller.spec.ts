import { Note } from "../../../../../src/features/notes/domain/models";
import { CacheRepository, NoteRepository } from "../../../../../src/features/notes/infra";
import { HttpRequest, NoteController, ok } from "../../../../../src/features/notes/presentation";

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

  describe('STORE', () => {
    test('should return code 200 when valid data is provided', async () => {
      jest.spyOn(NoteRepository.prototype, 'create')
        .mockResolvedValue(makeResult());

      const sut = makeSut();
      const result = await sut.store(makeRequestBody());

      expect(result).toEqual(ok(makeResult()));
    });
  });
});