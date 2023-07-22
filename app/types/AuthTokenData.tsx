import type { JwtPayload } from "jsonwebtoken";

export interface AuthTokenData extends JwtPayload {
  email: string;
  phoneNumber: null;
  username: string;
  name: string;
  image: string;
  data: Record<string, any>;
  confirmedAt: null | string;
  createdAt: string;
  updatedAt: string;
  mode: string;
  userId: number;
  userUuid: string;
  tenantId: string;
  sessionId: string;
  isConfirmed: boolean;
  iat: number;
  exp: number;
}

export interface CreateUserPayload {
  action: string; // enumerate later "create" and others.
  model: string;
  mode: string; // enumerate later ? 'test' vs 'prod?'
  record: AuthTokenData & {
    mode: string;
    phoneNumber?: string;
    locked: boolean;
    isMfaRequired?: boolean;
    authentication?: Record<string, any>;
  };
  authorization?: Record<string, any>;
}

export interface UserWebhookPayload {
  id: string;
  username: string;
  insertInstant: number;
  lastUpdateInstant: number;
  verified: boolean;
  passwordChangeRequired: boolean;
  passwordLastUpdateInstant: number;
  memberships: Array<string>;
}
