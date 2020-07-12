import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/authentication/auth.service';
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
  
  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated;    
    if(this.isAuthenticated) {
      this.router.navigate(['product-list']);
    }
  }

  login() {
    this.authService.login();
  }
}
