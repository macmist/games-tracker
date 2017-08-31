import {Component, OnInit} from "@angular/core";
import {User} from "../model/user";
import {Subscription} from "rxjs/Subscription";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-header',
  templateUrl: 'app/views/header.component.html',
  styleUrls: ['app/styles/header.component.css']
})

export class HeaderComponent implements OnInit {
  currentUser : User;
  private subscription: Subscription;
  constructor(private userService : UserService) {}

  ngOnInit() {
    this.userService.getCurrentUser().then(user => {this.currentUser = user;});
    this.subscription = this.userService.userEvents.subscribe((newUser: User) => {
      this.currentUser = newUser;
    });
  }
}
