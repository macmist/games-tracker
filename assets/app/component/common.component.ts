import {Component, OnInit} from '@angular/core';
import { UserService} from "../services/user.service";
import {User} from "../model/user";
import {GameService} from "../services/game.service";

@Component({
  selector: 'common',
  templateUrl: 'app/views/common.component.html',
  styleUrls: ['app/styles/common.component.css']
})
export class CommonComponent implements  OnInit{
  users: User[];
  checkedUser: number[] = [];
  res : any[] = [];
  games: any[] = [];

  gamesMap : Map<string, Map<number, number>> = new Map<string, Map<number, number>>();
  constructor(private userService : UserService,
              private gameService : GameService) {}
  getUsers(): void {
    this.userService.getUsers().then(_users => {
      this.users = _users
    });
  }

  ngOnInit() : void {
    this.getUsers();
  }

  manageList(i : number) : void {
    let index: number = this.checkedUser.indexOf(i);
    if (index !== -1) {
      this.checkedUser.splice(index, 1);
    }
    else this.checkedUser.push(i);
    this.retrieveCommonGames()
  }

  retrieveCommonGames() : void {
    if (this.checkedUser.length === 0) {
      this.renew();
    }
    else
      this.gameService.getCommonForUsers(this.checkedUser, this.userService.getToken()).then(res => {
        this.parseRes(res);
      }).catch(err => this.renew());
  }

  parseRes(res: any[]) {
    this.renew();
    for (let obj of res) {
      if (obj !== null && obj.name != null)

        if (this.gamesMap.get(obj.name) == null)
          this.gamesMap.set(obj.name, new Map<number, number>());
      this.gamesMap.get(obj.name).set(obj.user, obj.installed);
    }
    this.games = Array.from(this.gamesMap.keys());
  }


  renew() {
    this.gamesMap.clear();
    this.games = [];
  }
}
