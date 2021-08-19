import { User } from '../../../../core/domain';

export interface Note {
  uid: string;
  description: string;
  details?: string;
  userUid: string;
  user?: User;
}

