export interface JwtModuleOptions {
  accessTokenPrivateKey: string;
  refreshTokenPrivateKey: string;
}

export interface Payload {
  id: number;
}
