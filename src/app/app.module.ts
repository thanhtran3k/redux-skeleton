import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AccountModule } from './account/account.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ShellModule } from './shell/shell.module';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { HomeModule } from './home/home.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { Dispatcher } from './app.dispatcher';
import { AuthorizeInterceptor } from './core/authentication/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    AuthCallbackComponent
  ],
  imports: [    
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    //My modules
    CoreModule,
    HomeModule,
    AccountModule,
    AppRoutingModule,
    ShellModule,
    //End

    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    NgbModule,
    StoreDevtoolsModule.instrument({
      maxAge: 10 //  Buffers the last 10 states
    }),
  ],
  providers: [
    Dispatcher,
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthorizeInterceptor, 
      multi: true 
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
