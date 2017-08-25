import {Inject, Injectable} from "@angular/core";
import {Game} from "../model/game";
import {Http, Headers, RequestOptions} from "@angular/http";
import {User} from "../model/user";
import 'rxjs/add/operator/toPromise';
import {UserGame} from "../model/usergame";

@Injectable()
export class GameService {
  private url = '/api/game';


  constructor(@Inject(Http) private http: Http) {}

  getGames() : Promise<Game[]> {
    return this.http.get(this.url).toPromise()
      .then(response => {
        console.log(response.json());
        return response.json() as Game[]
      })
      .catch(this.handleError);
  }

  getUserGames(userId: number, token: string) : Promise<UserGame[]> {
    let options = this.getAuth(token);
    return this.http.get('/api/user/' + userId + '/games', options)
      .toPromise().then(usergames => {
        return usergames.json();
      }).catch(err => {return Promise.resolve(null)});
  }

  getUnownedGames(userId: number, token: string) : Promise<any[]> {
    return this.http.get('/api/user/'+ userId + '/unownedgames', this.getAuth(token)).toPromise()
      .then(res => {
        return res.json();
      }).catch(err => {return Promise.resolve(null)});
  }

  addUserGame(token: string, body: {}) : Promise<UserGame> {
    let options = this.getAuth(token);
    return this.http.post('/api/games', body, options).toPromise().
    then(
      user => {return user.json()})
      .catch(err => {return  Promise.resolve(null)});
  }

  addManyUserGame(token: string, games: Array<any>) : Promise<UserGame[]>
  {
    let options = this.getAuth(token);
    let body = {games: games};
    return this.http.post('/api/games/many', body, options).toPromise()
      .then(games => {return games.json();});
  }


  getCommonForUsers(ids: Array<number>, token: string) : Promise<any> {
    return this.http.get('/api/games/commons/?ids=' + ids.join(), this.getAuth(token)).toPromise()
      .then(res => {
        return res.json();
      })
  }

  updateInstallation(token: string, id: number, installed: boolean){
    let url = '/api/games/' + id;
    let body = {installed: installed};
    console.log(body);
    return this.http.put(url, body, this.getAuth(token)).toPromise()
      .then(res => {
        return res.json();
      })
  }


  getAuth(token: string) : RequestOptions {
    let headers = new Headers();
    headers.append("Authorization", 'Bearer ' + token);
    let options = new RequestOptions({headers: headers});
    return options;
  }





  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
