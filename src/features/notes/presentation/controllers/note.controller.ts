import { HttpRequest, HttpResponse } from '../../../../core/presentation';
import { notFound, ok, serverError } from '../../../../core/presentation';
import { MVCController } from '../../../../core/presentation';
import { CacheRepository, NoteRepository } from '../../infra';

export class ProjectController implements MVCController {
  readonly #repository: NoteRepository;
  readonly #cache: CacheRepository;

  constructor(repository: NoteRepository, cache: CacheRepository) {
    this.#repository = repository;
    this.#cache = cache;
  }

  public async index(request: HttpRequest): Promise<HttpResponse> {
    const { userUid } = request.params;
    try {
      const cache = await this.#cache.get(`note:${userUid}:all`);

      if (cache) {
        return ok(cache);
      }

      const notes = await this.#repository.getAll(userUid);

      if (notes.length <= 0) {
        return notFound();
      }

      await this.#cache.set(`note:${userUid}:all`, notes);

      return ok(notes);
    } catch (error) {
      return serverError();
    }
  }

  public async show(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { uid } = request.params;

      const cache = await this.#cache.get(`note:${uid}`);

      if (cache) {
        return ok(cache);
      }

      const note = await this.#repository.getOne(uid);

      if (!note) {
        return notFound();
      }

      await this.#cache.set(`note:${uid}`, note);

      return ok(note);
    } catch (error) {
      return serverError();
    }
  }

  public async store(request: HttpRequest): Promise<HttpResponse> {
    try {
      const note = await this.#repository.create(request.body);
      return ok(note);
    } catch (error) {
      console.log(error);

      return serverError();
    }
  }

  public async update(request: HttpRequest): Promise<HttpResponse> {
    const { uid } = request.params;

    try {
      const result = await this.#repository.update(uid, request.body);

      //TODO tem que fazer um esquema aqui para setar o novo cache

      await this.#cache.set(`note:${uid}`, result);

      return ok(result);
    } catch (error) {
      return serverError();
    }
  }

  public async delete(request: HttpRequest): Promise<HttpResponse> {
    const { uid } = request.params;

    try {
      await this.#repository.delete(uid);
      await this.#cache.delete(`note:${uid}`);

      return ok(null);
    } catch (error) {
      return serverError();
    }
  }
}