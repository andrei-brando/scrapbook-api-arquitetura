import { CacheRepository } from "../../../notes/infra";
import { HttpRequest, HttpResponse, MVCController, notFound, ok, serverError } from "../../../notes/presentation";
import { AuthRepository } from "../../infra";

export class AuthController implements MVCController {
  readonly #repository: AuthRepository;
  readonly #cache: CacheRepository;

  constructor(repository: AuthRepository, cache: CacheRepository) {
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
    try {
      const user = await this.#repository.signIn(request.body);

      if (!user) return notFound();

      return ok({
        message: 'Usuário encontrado, você será redirecionado para o sistema',
        uid: user.uid,
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