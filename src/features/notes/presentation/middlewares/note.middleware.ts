import { badRequest, ok } from "../../../../core/presentation";
import { HttpRequest, HttpResponse } from "../../../../core/presentation";
import { RequireFieldsValidator } from "../../../../core/presentation";
import { Note } from "../../domain/models";

export class NoteMiddleware {
  private fields = ['description', 'userUid'];

  async handle(request: HttpRequest): Promise<HttpResponse> {
    const body: Note = request.body;

    for (const field of this.fields) {
      const error = new RequireFieldsValidator(field).validate(body);

      if (error) {
        return badRequest(error);
      }
    }

    return ok({});
  }
}