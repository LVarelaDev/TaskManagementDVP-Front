export type loginResponse = {
  token: string;
  user: userDto;
}

export type userDto = {
  id: number;
  name: string;
  lastName: string;
  username: string;
  email: string;
  rolId: number;
}

export type LoginDTO = {
  Username: string;
  Password: string;
}