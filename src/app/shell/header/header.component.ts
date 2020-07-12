import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/authentication/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  name: string;
  isAuthenticated: boolean;

  constructor(private authService: AuthService) { }

  async ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated;
    if (this.isAuthenticated) {
      this.name = await this.authService.getName();
    }
  } 

   async signout() {
    await this.authService.signout();
  }
}
