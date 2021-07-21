## Library to integrate [Recaptcha v3](https://developers.google.com/recaptcha/docs/v3) with Angular

[![npm version](https://badge.fury.io/js/%40alekremi%2Fngx-recaptcha-v3.svg)](https://badge.fury.io/js/%40alekremi%2Fngx-recaptcha-v3)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/@alekremi/ngx-recaptcha-v3)
![Depfu](https://img.shields.io/depfu/alekremi/ngx-recaptcha-v3)

Google reCaptcha v3 service implementation for Angular 12 and beyond.

### Demo

StackBlitz [live example](https://stackblitz.com/edit/ngx-recaptcha-v3-example).

### Installation

```bash
npm install --save @alekremi/ngx-recaptcha-v3
```

### Usage

Import `NgxRecaptchaV3Module` to Angular AppModule.

```javascript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';

import { NgxRecaptchaV3Module } from '@alekremi/ngx-recaptcha-v3';

import { AppComponent } from './app.component';

@NgModule({
  imports: [BrowserModule, HttpClientModule, HttpClientXsrfModule, NgxRecaptchaV3Module],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

Jnject `NgxRecaptchaV3Service` in your component / service and then use `execute` method with your action.
Once you have the token, you need to verify it on your backend to get meaningful results.

For example if your external `LoginService` looks like:

```javascript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user';

@Injectable()
export class LoginService {
  constructor(private httpClient: HttpClient) {}

  login(username: string, password: string): Observable<User> {
    return this.httpClient.post<User>('https://my-domain.com/api/login', { username, password });
  }
}

```

then `NgxRecaptchaV3Service` using:

```javascript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user';

import { NgxRecaptchaV3Service } from '@alekremi/ngx-recaptcha-v3';

@Injectable()
export class LoginService {
  constructor(private httpClient: HttpClient, private recaptchaV3Service: NgxRecaptchaV3Service) {}

  login(username: string, password: string): Observable<User> {
    return this.recaptchaV3Service
      .execute(RECAPTCHA_SITE_KEY, 'login')
      .pipe(mergeMap((token) => this.httpClient.post<User>('https://my-domain.com/api/login', { username, password, token })));
  }
}

```

### Advanced usage

Additionaly you can provide `NgxRecaptchaOptions`:

| Option      | Optional | Description                                                    |
| ----------- | -------- | -------------------------------------------------------------- |
| language    | Yes      | reCaptcha language (badge, errors and etc.)                    |
| badgeHidden | Yes      | provide if you want execute reCaptcha action with hidden badge |

#### Execute action with provided language:

reCaptcha supported languages: https://developers.google.com/recaptcha/docs/language

```javascript
this.recaptchaV3Service.execute(RECAPTCHA_SITE_KEY, 'login', { language: 'de' });
```

#### Execute action with hidden badge:

```javascript
this.recaptchaV3Service.execute(RECAPTCHA_SITE_KEY, 'login', { badgeHidden: true });
```

Note: You are allowed to hide the badge as long as you include the reCAPTCHA branding visibly in the user flow.
Please include the following text:

```javascript
This site is protected by reCAPTCHA and the Google
    <a href="https://policies.google.com/privacy">Privacy Policy</a> and
    <a href="https://policies.google.com/terms">Terms of Service</a> apply.
```

For more info see FAQ: https://developers.google.com/recaptcha/docs/faq#id-like-to-hide-the-recaptcha-badge.-what-is-allowed

#### Unload reCaptcha manually:

```javascript
this.recaptchaV3Service.unload();
```

This method will remove recaptcha badge and scripts.
