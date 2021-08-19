import { HttpRequest, HttpResponse } from '../../../../core/presentation';
import { notFound, ok, serverError } from '../../../../core/presentation';
import { MVCController } from '../../../../core/presentation';
import { Note } from '../../domain/models';
import { CacheRepository, NoteRepository } from '../../infra';

export class NoteController implements MVCController {
  readonly #repository: NoteRepository;
  readonly #cache: CacheRepository;

  constructor(repository: NoteRepository, cache: CacheRepository) {
    this.#repository = repository;
    this.#cache = cache;
  }

  public async index(request: HttpRequest): Promise<HttpResponse> {
    const { userUid } = request.params;
    try {
      const cache = await this.#cache.get(`notes:all:user:${userUid}`);

      if (cache) return ok(cache);

      const notes = await this.#repository.getAll(userUid);

      if (!notes || notes.length <= 0) return notFound();

      await this.#cache.set(`notes:all:user:${userUid}`, notes);

      return ok(notes);
    } catch (error) {
      return serverError();
    }
  }

  public async show(request: HttpRequest): Promise<HttpResponse> {
    const { uid } = request.params;
    try {
      const cache = await this.#cache.get(`notes:${uid}`);

      if (cache) return ok(cache);

      const note = await this.#repository.getOne(uid);

      if (!note) return notFound();

      await this.#cache.set(`notes:${uid}`, note);

      return ok(note);
    } catch (error) {
      return serverError();
    }
  }

  public async store(request: HttpRequest): Promise<HttpResponse> {
    try {
      const note = await this.#repository.create(request.body);

      await this.#cache.delete(`notes:all:user:${note.userUid}`);

      return ok(note);
    } catch (error) {
      return serverError();
    }
  }

  public async update(request: HttpRequest): Promise<HttpResponse> {
    const { uid } = request.params;

    try {
      const note = await this.#repository.getOne(uid);

      if (!note) return notFound();

      await this.#repository.update(uid, request.body);

      await this.#cache.delete(`notes:${uid}`);
      await this.#cache.delete(`notes:all:user:${note.userUid}`);

      return ok(null);
    } catch (error) {
      return serverError();
    }
  }

  public async delete(request: HttpRequest): Promise<HttpResponse> {
    const { uid } = request.params;

    try {
      const note = await this.#repository.getOne(uid);

      if (!note) return notFound();

      await this.#repository.delete(uid);
      await this.#cache.delete(`notes:${uid}`);
      await this.#cache.delete(`notes:all:user:${note.userUid}`);

      return ok(null);
    } catch (error) {
      return serverError();
    }
  }
}