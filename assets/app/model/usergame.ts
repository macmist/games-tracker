import {Game} from "./game";
import {User} from "./user";

export class UserGame {
  id: number;
  game: Game;
  user: User;
  installed: boolean;
  createdAt: string;
  updatedAt: string;

}
