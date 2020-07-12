import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserManager, User } from 'oidc-client';
import { BehaviorSubject } from 'rxjs';

import { BaseService } from 'src/app/shared/services/base.service';
import { USERINFO_LS, IDENTITY_CONFIG } from 'src/environments/app.config';

@Injectable({
  providedIn: 'root'
})

export class AuthService extends BaseService {
  private manager = new UserManager(settings);
  private user: User | null;
  isAuthenticated = false;

  constructor(protected http: HttpClient) {
    super(http);
    this.baseUrl = IDENTITY_CONFIG.IDENTITY_SERVER;

    const userInfo = this.getUserFromLs();
    if (userInfo) {
      const { access_token: accessToken, id_token: idToken,  expires_at: expiresAt } = Object(userInfo)
      const datetimeNow = Math.floor(Date.now() / 1000);
      if(accessToken && (expiresAt > datetimeNow)) this.isAuthenticated = true;
      this.user = userInfo;      
    }
  }

  async saveUserInfoToLs(user: User) {
    return localStorage.setItem(`${USERINFO_LS}`, JSON.stringify(user));
  }

  public async getAccessToken() {
    const userInfo = this.getUserFromLs();
    const token = userInfo.access_token;
    return token;
  }

  async login() {
    if (!this.isAuthenticated) {
      this.manager.signinRedirect();
    }
  }

  async completeAuthentication() {
    const user = await this.manager.signinRedirectCallback();
    await this.saveUserInfoToLs(user);
    this.isAuthenticated = true;
  }

  register(registrationInput: any) {
    const url = '/Account/RegisterUser';
    return this.post<any>(url, registrationInput);
  }

  get authorizationHeaderValue(): string {
    return `${this.user.token_type} ${this.user.access_token}`;
  }

  async getName() {
    if (this.isAuthenticated) {
      const userInfo = this.getUserFromLs();
      const name = userInfo.profile.name ?? null;
      return name;
    }
  }

  async signout() {
    localStorage.clear();
    await this.manager.signoutRedirect();
  }

  getUserFromLs() {
    const ls = localStorage.getItem('userInfo');
    const userInfo = JSON.parse(ls);
    return userInfo;
  }
}

const settings = {
  authority: IDENTITY_CONFIG.IDENTITY_SERVER,
  client_id: IDENTITY_CONFIG.CLIENT_ID,
  redirect_uri: IDENTITY_CONFIG.APPLICATION_URL + '/auth-callback',
  post_logout_redirect_uri: IDENTITY_CONFIG.APPLICATION_URL + '/home',
  response_type: IDENTITY_CONFIG.RESPONSE_TYPE,
  scope: IDENTITY_CONFIG.SCOPE,
  filterProtocolClaims: true,
  loadUserInfo: true,
  automaticSilentRenew: true,
  silent_redirect_uri: IDENTITY_CONFIG.APPLICATION_URL + '/silent-refresh.html'
};
