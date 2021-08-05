import { Router } from 'express';
import { EMVC } from '../../../../core/presentation';
import { middlewareAdapter, routerMvcAdapter } from '../../../../core/presentation';
import { UserController } from '../controllers';
import { MVCController } from '../../../../core/presentation';
import { CacheRepository, UserRepository } from '../../infra';
import { UserMiddleware } from '../middlewares';

const makeController = (): MVCController => {
  const repository = new UserRepository();
  const cache = new CacheRepository();
  return new UserController(repository, cache);
};

export default class UserRoutes {
  public init(routes: Router) {
    routes.get('/users',
      routerMvcAdapter(makeController(), EMVC.INDEX));

    routes.get('/users/:uid',
      routerMvcAdapter(makeController(), EMVC.SHOW));

    routes.post('/users',
      middlewareAdapter(new UserMiddleware()),
      routerMvcAdapter(makeController(), EMVC.STORE));

    routes.put('/users/:uid',
      routerMvcAdapter(makeController(), EMVC.UPDATE));

    routes.delete('/users/:uid',
      routerMvcAdapter(makeController(), EMVC.DELETE));
  }
}