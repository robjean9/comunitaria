import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponentComponent } from './login-component/login-component.component';
import { SignupComponent } from './signup/signup.component';
import { UserComponent } from './user/user.component';
import { AuthGuardService } from './services/auth.guard';

const routes: Routes = [
  {path: 'login', component: LoginComponentComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'me', component: UserComponent, canActivate: [AuthGuardService]},
  {path: '', component: UserComponent, canActivate: [AuthGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
