import {Component, OnInit} from '@angular/core';
import { UserService} from "../services/user.service";
import {User} from "../model/user";

import {Subscription} from "rxjs/Subscription";


@Component({
  selector: 'games',
  templateUrl: 'app/views/app.component.html',
  styleUrls: ['app/styles/app.component.css']
})
export class AppComponent implements OnInit {
  private subscription: Subscription;

  constructor(private userService: UserService) {}
  ngOnInit() {
    this.subscription = this.userService.userEvents.subscribe((newUser: User) => {

    });
  }
}
