import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { USERINFO_LS } from 'src/environments/app.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  isAuthenticated: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
    ) { }
  
  async ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated;    
    if(this.isAuthenticated) {
	  //Go Somewhere
    }
  }

  test() {
    this.router.navigate(['product-list']);
  }

  login() {
    this.authService.login();
  }
}
