
import {Inject, Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import {Config} from "../config/config";

@Injectable()
export class SteamService {
  private getIdUrl = '/api/user/steamid';
  private steamToken : string = Config.steamAPIToken;

  constructor(@Inject(Http) private http: Http) {}

  getSteamId(vanityUrl: string) : Promise<any> {
    return this.http.get(this.getIdUrl + '?key=' + this.steamToken + '&vanityurl=' + vanityUrl, this.getAuth())
      .toPromise()
      .then(response => {
        return response.json();
      })
      .catch(this.handleError);
  }

  getSteamGames(steamid: string) : Promise<any> {
    return this.http.get('/api/user/steamgames/?key=' + this.steamToken + '&steamid=' + steamid, this.getAuth())
      .toPromise().then(response => {
        return response.json();
      }).catch(this.handleError);
  }

  getAuth() : RequestOptions {
    let token = localStorage.getItem('token');
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
