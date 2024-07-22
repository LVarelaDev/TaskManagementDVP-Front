export type TaskDTO = {
  code: number;
  title: string;
  description: string;
  type: string;
  statusId: number;
  active: boolean;
  startDate: string | null;
  endDate: string | null;
  assignedUserId: number | null;
  createdDate: string;
  createdUser: string;
};

export type UsersSelectDTO = {
  id: number;
  name: string;
  lastName: string;
};

export type UpdatePayload = {
  code: number;
  title: string;
  description: string;
  type: string;
  user: string;
  assignedUserId: number;
  status: number;
};

export type UpdateStatus = {
    code: number;
    status:number;
}

export type PayloadCreateTask = {
    title: string;
    description: string;
    type: string;
    user: string;
    assignedUserId: number | null;
}