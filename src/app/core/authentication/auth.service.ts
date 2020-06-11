import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserManager, User } from 'oidc-client';
import { BehaviorSubject, Observable, from } from 'rxjs';

import { BaseService } from 'src/app/shared/services/base.service';
import { USERINFO_LS, IDENTITY_CONFIG } from 'src/environments/app.config';

@Injectable({
  providedIn: 'root'
})

export class AuthService extends BaseService {

  private _authNavStatusSource = new BehaviorSubject<boolean>(false);
  authNavStatus$ = this._authNavStatusSource.asObservable();

  private manager = new UserManager(settings);
  private user: User | null;

  constructor(protected http: HttpClient) {
    super(http);
    this.baseUrl = IDENTITY_CONFIG.IDENTITY_SERVER;

    this.manager.getUser().then(user => {
      this.user = user;
      this._authNavStatusSource.next(this.isAuthenticated());
    });
  }

  saveUserInfoToLs() {
    localStorage.setItem(`${USERINFO_LS}`, JSON.stringify(this.user));
  }

  public getAccessToken() {
    return this.user.access_token;
  }

  login() {
    return this.manager.signinRedirect();
  }

  async completeAuthentication() {
    this.user = await this.manager.signinRedirectCallback();
    this._authNavStatusSource.next(this.isAuthenticated());
  }

  register(registrationInput: any) {
    const url = '/Account/RegisterUser';
    return this.post<any>(url, registrationInput);
  }

  isAuthenticated(): boolean {
    return this.user != null && !this.user.expired;
  }

  get authorizationHeaderValue(): string {
    return `${this.user.token_type} ${this.user.access_token}`;
  }

  get name(): string {
    return this.user != null ? this.user.profile.name : '';
  }

  async signout() {
    localStorage.clear();
    await this.manager.signoutRedirect();
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
