import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { USERINFO_LS } from 'src/environments/app.config';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  isAuthorized: boolean = false;

  constructor(private authService: AuthService) { }
  
  ngOnInit() {
    this.isAuthorized = this.authService.isAuthenticated();    
    if(this.isAuthorized) {
      this.authService.saveUserInfoToLs();
    }
  }

  login() {
    this.authService.login();
  }
}
