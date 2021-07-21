import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxRecaptchaV3Module } from 'projects/ngx-recaptcha-v3/src/lib/ngx-recaptcha-v3.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ReactiveFormsModule, NgxRecaptchaV3Module],
  bootstrap: [AppComponent]
})
export class AppModule {}
