import { badRequest, HttpRequest, HttpResponse, MVCController, ok, serverError, UserAlreadyExistsError } from "../../../../core/presentation";
import { CacheRepository, UserRepository } from "../../infra";

export class UserController implements MVCController {
  readonly #repository: UserRepository;
  readonly #cache: CacheRepository;

  constructor(repository: UserRepository, cache: CacheRepository) {
    this.#repository = repository;
    this.#cache = cache;
  }

  async index(request: HttpRequest): Promise<HttpResponse> {
    throw new Error("Method not implemented.");
  }

  async show(request: HttpRequest): Promise<HttpResponse> {
    throw new Error("Method not implemented.");
  }

  async store(request: HttpRequest): Promise<HttpResponse> {
    const { email } = request.body;

    try {
      const userAlreadyExists = await this.#repository.getOneByEmail(email)

      if (userAlreadyExists) return badRequest(new UserAlreadyExistsError());

      const user = await this.#repository.create(request.body);

      return ok(user);
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