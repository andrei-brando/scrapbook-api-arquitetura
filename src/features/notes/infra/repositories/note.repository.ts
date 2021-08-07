import { NoteEntity } from "../../../../core/infra";
import { Note } from "../../domain/models";

export class NoteRepository {
  async create(params: Note): Promise<Note> {
    const { details, description, userUid } = params;

    const note = await NoteEntity.create({
      description,
      details,
      userUid
    }).save();

    return Object.assign({}, params, note);
  }

  async getAll(userUid: string): Promise<Note[]> {
    const notes = await NoteEntity.find({
      where: { userUid },
      relations: ['user']
    });

    const result = notes.map(note => ({
      uid: note.uid,
      details: note.details,
      description: note.description,
      userUid: note.userUid,
      user: note.user,
    }));

    return result;
  }

  async getOne(uid: string): Promise<Note | null> {
    const note = await NoteEntity.findOne(uid);

    if (!note) return null;

    return {
      uid: note.uid,
      details: note.details,
      description: note.description,
      userUid: note.userUid,
      user: note.user,
    };
  }

  async update(uid: string, params: Note): Promise<Note | null> {
    const { description, details } = params;

    const note = await NoteEntity.findOne(uid);

    if (!note) return null;

    note.description = description;
    note.details = details;

    note.save();

    return note;
  }

  public async delete(uid: string): Promise<void> {
    const note = await NoteEntity.findOne(uid);

    if (note) note.remove();
  }
}