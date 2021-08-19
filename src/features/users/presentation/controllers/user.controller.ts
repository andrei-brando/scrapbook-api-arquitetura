import { CacheRepository } from "../../../notes/infra";
import { badRequest, HttpRequest, HttpResponse, MVCController, notFound, ok, serverError, UserAlreadyExistsError } from "../../../notes/presentation";
import { UserRepository } from "../../infra";

export class UserController implements MVCController {
  readonly #repository: UserRepository;
  readonly #cache: CacheRepository;

  constructor(repository: UserRepository, cache: CacheRepository) {
    this.#repository = repository;
    this.#cache = cache;
  }

  async index(request: HttpRequest): Promise<HttpResponse> {
    throw new Error("Method not implemented.");
    // try {
    //   const cache = await this.#cache.get(`user:all`);

    //   if (cache) return ok(cache);

    //   const users = await this.#repository.getAll();

    //   if (!users) return notFound();

    //   await this.#cache.set(`user:all`, users);

    //   return ok(users);
    // } catch (error) {
    //   return serverError();
    // }
  }

  async show(request: HttpRequest): Promise<HttpResponse> {
    throw new Error("Method not implemented.");
    // const { uid } = request.params;

    // try {
    //   const cache = await this.#cache.get(`user:${uid}`);

    //   if (cache) return ok(cache);

    //   const user = await this.#repository.getOne(uid);

    //   if (!user) return notFound();

    //   await this.#cache.set(`user:${uid}`, user);

    //   return ok(user);
    // } catch (error) {
    //   return serverError();
    // }
  }

  async store(request: HttpRequest): Promise<HttpResponse> {
    const { email } = request.body;

    try {
      const userAlreadyExists = await this.#repository.getOneByEmail(email)

      if (userAlreadyExists) return badRequest(new UserAlreadyExistsError());

      const user = await this.#repository.create(request.body);

      return ok({
        message: 'User Created',
        user
      });
    } catch (error) {
      return serverError();
    }
  }

  async update(request: HttpRequest): Promise<HttpResponse> {
    throw new Error("Method not implemented.");
  }

  async delete(request: HttpRequest): Promise<HttpResponse> {
    throw new Error("Method not implemented.");
  }
}