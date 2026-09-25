export type AuthCredentials = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  email: string;
};

export type Board = {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
};

export type CreateBoardInput = {
  name: string;
};
