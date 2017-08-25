import {User} from "./user";

export class Game {
  id: number;
  name: string;
  steamId: string;
  createdAt: string;
  updatedAt: string;
  owners: User[];
}
