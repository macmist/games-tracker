import {EventEmitter, Inject, Injectable} from '@angular/core';
import { User } from '../model/user';
import {Headers, Http, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {noUndefined} from "@angular/compiler/src/util";
import {Router} from "@angular/router";



@Injectable()
export class UserService {
  private url = '/api/user';
  private loginUrl= '/api/login';
  public userEvents: EventEmitter<User> = new EventEmitter();
  currentUser : User;
  token: string;

  constructor(@Inject(Http) private http: Http,
              @Inject(Router) private router: Router) {
  }

  userChanged() {
    this.userEvents.emit(this.currentUser);
  }

  getUsers(): Promise<User[]> {
    return this.http.get(this.url).toPromise()
      .then(response => {
        return response.json() as User[]
      })
      .catch(this.handleError);
  }

  login(login: string, pass: string) : Promise<User> {
    let data = {login : login, pass: pass};
    return this.http.post(this.loginUrl, JSON.stringify(data))
      .toPromise().then(res => {

        this.token = res.json().token;
        this.currentUser = res.json().user;
        localStorage.setItem('token', this.token);
        this.userChanged();
        return this.currentUser;
      })
  }

  logout() : Promise<void> {
    return this.http.get('/api/logout').toPromise()
      .then(a => {
        this.currentUser = null;
        localStorage.removeItem('token');
        // window.location.replace('/');
        this.userChanged();
        this.router.navigate(['home']);
      }).catch(a => {
        this.currentUser = null;
        localStorage.removeItem('token');
        // window.location.replace('/');
        this.userChanged();
        this.router.navigate(['home']);
      });
  }

  getCurrentUser() : Promise<User> {
    if (!this.currentUser ||this.currentUser == null)
     return this.fetchUser().then(user => {
        this.currentUser = user;
        this.userChanged();
        return this.currentUser;
      });
    else {
      return Promise.resolve(this.currentUser);
    }
  }

  reloadCurrent() : Promise<User> {
    return this.fetchUser().then(user => {
      this.currentUser = user;
      this.userChanged();
      return this.currentUser;
    });
  }

  getToken(): string {
    return this.token;
  }

  updateUser(user: User) : Promise<any> {
    return  this.http.put(this.url + '/' + user.id, user, this.getAuth(this.token))
      .toPromise().then(res => {
        this.currentUser = res.json();
        this.userChanged();
        return this.currentUser;
      })
  }

  getAuth(token: string) : RequestOptions {
    let headers = new Headers();
    headers.append("Authorization", 'Bearer ' + token);
    let options = new RequestOptions({headers: headers});
    return options;
  }

  private fetchUser() : Promise<User> {
    let tok = localStorage.getItem('token');
    if (tok === undefined) tok = "";
    let headers = new Headers();
    headers.append("Authorization", 'Bearer ' + tok);
    let options = new RequestOptions({headers: headers});
    return this.http.get(this.url + '/current', options)
      .toPromise().then(user => {
        this.token = tok;
        return user.json();
      }).catch(err => {return Promise.resolve(null)});
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}

