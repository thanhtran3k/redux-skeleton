import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { USERINFO_LS } from 'src/environments/app.config';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
    const isAuthorized = this.authService.isAuthenticated();
    const userLs = localStorage.getItem(`${USERINFO_LS}`);
    
    if(isAuthorized && userLs == null) {
      this.authService.saveUserInfoToLs();
    }
  }

  login() {
    this.authService.login();
  }
}
