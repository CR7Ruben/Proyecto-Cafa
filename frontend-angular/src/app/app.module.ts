import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// COMPONENTES standalone
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EncryptComponent } from './pages/encrypt/encrypt.component';
import { DecryptComponent } from './pages/decrypt/decrypt.component';

// INTERCEPTOR
import { ApiInterceptor } from './interceptors/api.interceptor';

@NgModule({
  declarations: [
    AppComponent   
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,

    // IMPORTAMOS COMPONENTES standalone
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    EncryptComponent,
    DecryptComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
