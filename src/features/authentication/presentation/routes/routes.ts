import { Router } from 'express';
import { EMVC } from '../../../../core/presentation';
import { middlewareAdapter, routerMvcAdapter } from '../../../../core/presentation';
import { MVCController } from '../../../../core/presentation';
import { CacheRepository } from '../../../users/infra';
import { UserMiddleware } from '../../../users/presentation';
import { AuthRepository } from '../../infra';
import { AuthController } from '../controllers/auth.controller';

const makeController = (): MVCController => {
  const repository = new AuthRepository();
  const cache = new CacheRepository();
  return new AuthController(repository, cache);
};

export default class AuthenticationRoutes {
  public init(routes: Router) {
    routes.post('/login',
      middlewareAdapter(new UserMiddleware()),
      routerMvcAdapter(makeController(), EMVC.STORE));
  }
}