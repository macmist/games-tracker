import { Component, OnInit} from "@angular/core";
import {User} from "../model/user";
import {UserService} from "../services/user.service";
import {GameService} from "../services/game.service";
import {UserGame} from "../model/usergame";
import {SteamService} from "../services/steam.service";
import {Subscription} from "rxjs/Subscription";


@Component({
  selector: 'usergame',
  templateUrl: 'app/views/usergame.component.html'
})
export class UsergameComponent implements OnInit {
  currentUser : User;
  games: UserGame[];
  steamGames: any[];
  unownedGames: string[];
  newGame: {[k: string]: any}  = {};
  private subscription: Subscription;

  constructor(private userService: UserService,
              private gameService: GameService,
              private steamService: SteamService) {

  }

  ngOnInit() {
    this.userService.getCurrentUser().then(user => {
      this.currentUser = user;
      if (user !== null) {}
        this.getUnownedGames();
      this.initNewGame();
      this.games = [];
    });
    this.subscription = this.userService.userEvents.subscribe((newUser: User) => {
      this.currentUser = newUser;
      if (newUser !== null)
        this.getUnownedGames();
      this.initNewGame();
      this.games = [];
    });

  }

  initNewGame() {
    this.newGame.gameName = '';
    this.newGame.installed = false;
    if (this.currentUser != null)
      this.newGame.userId = this.currentUser.id;
  }

  getUsergames() {
    this.gameService.getUserGames(this.currentUser.id, this.userService.getToken()).then(ug => {
      this.games = ug;
    }).catch(err => {});
  }

  getUnownedGames() {
    this.gameService.getUnownedGames(this.currentUser.id, this.userService.getToken()).then(res => {

      this.unownedGames = res.map(({name}) => name);
    })
  }

  getSteamId(vanityUrl: string) {
      this.getSteamIdFinal(vanityUrl);
  }

  getSteamGames() {
    if (this.currentUser == null)
      return;
    this.steamService.getSteamGames(this.currentUser.steamId).then((tab : any) => {
      this.steamGames = tab;

      this.steamGames.forEach(e => {
        e['userId'] = this.currentUser.id;
        e['gameName'] = e.name;
        e['steamid'] = e.appid;
        delete e['playtime_forever'];
        delete e['img_icon_url'];
        delete e['img_logo_url'];
        delete e['has_community_visible_stats'];
        delete e.appid;
        delete e.name;
      });
      this.gameService.addManyUserGame(this.userService.getToken(), this.steamGames).then(games => {
        this.userService.reloadCurrent().then(user => {
          this.getUsergames();
        })
      });
    });
  }

  addGame() {
    this.gameService.addUserGame(this.userService.getToken(), this.newGame).then(res => {
      this.userService.reloadCurrent().then(user => {
        this.initNewGame();
        this.getUsergames();
      });

    });

  }

  updateGame(game: UserGame) {
    console.log(game.installed);
    console.log(!game.installed);
    this.gameService.updateInstallation(this.userService.getToken(), game.id, !game.installed).then(res => {
      this.getUsergames();
    }).catch(err => {});
  }



  getGameName(id: number) : string {
    return this.currentUser != null && this.currentUser.games != null
            ? this.currentUser.games.find(obj => obj.id === id).name
            : "";
  }

  getSteamIdFinal(vanityUrl: string) {
    if (!this.currentUser)
      return;
    this.steamService.getSteamId(vanityUrl).then(obj =>{

      this.currentUser.steamUrl = vanityUrl;
      this.currentUser.steamId = obj.response.steamid;
      console.log(this.currentUser.steamId);
      this.userService.updateUser(this.currentUser).then(obj => {
        console.log(obj);
        this.currentUser = obj;
      })
    });
  }
}
