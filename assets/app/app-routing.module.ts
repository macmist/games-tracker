import {RouterModule, Routes} from "@angular/router";
import {AppComponent} from "./component/app.component";
import {UsergameComponent} from "./component/usergame.component";
import {NgModule} from "@angular/core";
import {CommonComponent} from "./component/common.component";

const routes: Routes = [
  {path: 'home', component: CommonComponent},
  {path: 'profile', component: UsergameComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
