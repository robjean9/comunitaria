import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponentComponent } from './login-component/login-component.component';
import { SignupComponent } from './signup/signup.component';
import { UserComponent } from './user/user.component';
import { AuthGuardService } from './services/auth.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { CreateOcurrenceComponent } from './create-ocurrence/create-ocurrence.component';
import { OcurrencesComponent } from './ocurrences/ocurrences.component';

const routes: Routes = [
  {path: 'login', component: LoginComponentComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'fp', component: ForgotPasswordComponent},
  {path: 'me', component: UserComponent, canActivate: [AuthGuardService]},
  {path: '', component: OcurrencesComponent, canActivate: [AuthGuardService]},
  {path: 'ocurrences', component: OcurrencesComponent, canActivate: [AuthGuardService]},
  {path: 'ocurrences/create', component: CreateOcurrenceComponent, canActivate: [AuthGuardService]},
  {path: 'ocurrences/me', component: OcurrencesComponent, canActivate: [AuthGuardService]},
  {path: 'ocurrences/:id', component: CreateOcurrenceComponent, canActivate: [AuthGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
