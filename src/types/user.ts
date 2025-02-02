export type User = {
  name: string;
  email: string;
  avatarUrl: string;
}

export type AuthUser = User & {
  token: string;
}

export type AuthData = {
  email: string;
  password: string;
}
