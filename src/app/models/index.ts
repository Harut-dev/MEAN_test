export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface UsersListApi {
  users: User[];
  totalCount: number;
  totalArtists: number;
  totalDesigners: number;
}
