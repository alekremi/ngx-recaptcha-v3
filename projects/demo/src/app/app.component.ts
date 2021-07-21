import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxRecaptchaV3Service } from 'projects/ngx-recaptcha-v3/src/public-api';

const RECAPTCHA_SITE_KEY = '6Ldb528UAAAAAMD7bdsxQz2gQSl-Jb-kGTyAHThi';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private recaptchaV3Service: NgxRecaptchaV3Service) {
    this.form = this.formBuilder.group({
      action: ['login', [Validators.required]],
      language: ['en'],
      badgeHidden: []
    });
  }

  getControlValue = (controlName: 'action' | 'language' | 'badgeHidden'): unknown => this.form.get(controlName)?.value;

  executeAction(): void {
    this.recaptchaV3Service
      .execute(RECAPTCHA_SITE_KEY, this.getControlValue('action') as string, {
        language: this.getControlValue('language') as string,
        badgeHidden: this.getControlValue('badgeHidden') as boolean
      })
      .subscribe(
        (token) => {
          console.log(token);
          alert(`token: ${token}`);
        },
        (error) => console.error(error)
      );
  }

  unloadScript(): void {
    this.recaptchaV3Service.unload();
  }
}
