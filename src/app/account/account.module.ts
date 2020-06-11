import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AccountRoutingModule } from './account-routing.module';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../core/authentication/auth.service';

@NgModule({
  declarations: [
    LoginComponent, 
    RegisterComponent
  ],
  providers: [
    AuthService
  ],
  imports: [
    CommonModule,
    FormsModule,
    AccountRoutingModule,
  ]
})
export class AccountModule { }
