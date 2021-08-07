import { Router } from 'express';
import { EMVC } from '../../../../core/presentation';
import { middlewareAdapter, routerMvcAdapter } from '../../../../core/presentation';
import { ProjectController } from '../controllers';
import { MVCController } from '../../../../core/presentation';
import { CacheRepository, NoteRepository } from '../../infra';
import { NoteMiddleware } from '../middlewares';

const makeController = (): MVCController => {
  const repository = new NoteRepository();
  const cache = new CacheRepository();
  return new ProjectController(repository, cache);
};

export default class NotesRoutes {
  public init(routes: Router) {
    routes.get('/notes/all/:userUid',
      routerMvcAdapter(makeController(), EMVC.INDEX));

    routes.get('/notes/:uid',
      routerMvcAdapter(makeController(), EMVC.SHOW));

    routes.post('/notes',
      middlewareAdapter(new NoteMiddleware()),
      routerMvcAdapter(makeController(), EMVC.STORE));

    routes.put('/notes/:uid',
      routerMvcAdapter(makeController(), EMVC.UPDATE));

    routes.delete('/notes/:uid',
      routerMvcAdapter(makeController(), EMVC.DELETE));
  }
}