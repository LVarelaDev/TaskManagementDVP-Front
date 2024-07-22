export type UserDto = {
  id: number;
  name: string;
  lastName: string;
  username: string;
  email: string;
  rolId: number;
};

export type userFilters = {
  searchValue: string;
};

export type CreateUserPayload = {
  name: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  user: string;
  rolId: number;
};

export type UpdateUserPayload = {
  id: number;
  name: string;
  lastName: string;
  username: string;
  email: string;
  user: string;
  rolId: number;
};
