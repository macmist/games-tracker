import { NgModule } from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { AppComponent }   from './component/app.component';
import { HttpModule }    from '@angular/http';
import { UserService } from "./services/user.service"
import {LoginComponent} from "./component/login.component";
import {GameService} from "./services/game.service";
import {UsergameComponent} from "./component/usergame.component";
import {SteamService} from "./services/steam.service";
import {IteratorToArrayPipe} from "./pipes/iterator-to-array.pipe";
import {AppRoutingModule} from "./app-routing.module";
import {HeaderComponent} from "./component/header.component";
import {CommonComponent} from "./component/common.component";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [AppComponent, LoginComponent, UsergameComponent, IteratorToArrayPipe, HeaderComponent, CommonComponent],
  imports:      [BrowserModule, HttpModule, AppRoutingModule, FormsModule],
  providers:    [UserService, GameService, SteamService],
  bootstrap:    [AppComponent],
})
export class AppModule {}
