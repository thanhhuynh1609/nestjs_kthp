export interface Payload {
  username: string;
  seller: boolean;
  admin: boolean;
  iat?: number;
  expiresIn?: string;
}
