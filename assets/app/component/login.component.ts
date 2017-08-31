import {Component, Input, OnInit} from '@angular/core';
import { UserService} from "../services/user.service";
import {User} from "../model/user";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'login',
  templateUrl: 'app/views/login.component.html',
  styleUrls: ['app/styles/login.component.css']
})
export class LoginComponent implements OnInit {
  currentUser : User;
  private subscription: Subscription;
  constructor(private userService : UserService) {}

  ngOnInit() {
    this.userService.getCurrentUser().then(user => {this.currentUser = user;});
    this.subscription = this.userService.userEvents.subscribe((newUser: User) => {
      this.currentUser = newUser;
    });
  }


  test(param: string, other: string) {
    console.log(param + ' ' + other);
  }

   log(login: string, pass: string) {
    this.userService.login(login, pass).then(user => this.currentUser = user);
  }

  disconnect() {
    this.userService.logout().then(a => this.currentUser = null);
  }
}
