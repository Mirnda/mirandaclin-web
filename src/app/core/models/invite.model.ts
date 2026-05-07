import { UserRole } from './user.model';

export interface Invite {
  id: string;
  tenant_id: string;
  email: string;
  role: UserRole;
  token: string;
  event_id: string;
  expires_at: string;
  used_at: string;
  created_at: string;
}

export interface CreateInviteRequest {
  email: string;
  profile_id: string;
}
