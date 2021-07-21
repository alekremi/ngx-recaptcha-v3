import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { filter, mergeMap, take } from 'rxjs/operators';

import { NgxRecaptchaOptions, NgxRecaptchaV3Window } from './ngx-recaptcha-v3';

const RECAPTCHA_BADGE_CLASS = 'grecaptcha-badge';
const RECAPTCHA_GOOGLE_URL = 'https://www.google.com/recaptcha';
const RECAPTCHA_GSTATIC_URL = 'https://www.gstatic.com/recaptcha';

@Injectable()
export class NgxRecaptchaV3Service {
  private scriptLoadedSubject: BehaviorSubject<boolean>;
  private window: NgxRecaptchaV3Window;
  private options: NgxRecaptchaOptions | undefined;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.window = this.document.defaultView as unknown as NgxRecaptchaV3Window;
    this.scriptLoadedSubject = new BehaviorSubject<boolean>(false);
  }

  execute(siteKey: string, action: string, options?: NgxRecaptchaOptions): Observable<string> {
    this.init(siteKey, options);
    return this.scriptLoadedSubject.pipe(
      filter((loaded) => loaded != false),
      mergeMap(() => from(this.window.grecaptcha.execute(siteKey, { action }))),
      take(1)
    );
  }

  unload(): void {
    this.removeBadge();
    this.removeScripts();
    this.scriptLoadedSubject.next(false);
  }

  private isBadgeVisibilityChanged = (options?: NgxRecaptchaOptions): boolean => options?.badgeHidden !== this.options?.badgeHidden;
  private isLanguageChanged = (options?: NgxRecaptchaOptions): boolean => options?.language !== this.options?.language;
  private scriptNotLoaded = (): boolean => !this.scriptLoadedSubject.value;

  private init(siteKey: string, options?: NgxRecaptchaOptions): void {
    if (this.scriptNotLoaded()) {
      this.load(siteKey, options);
    } else if (this.isLanguageChanged(options)) {
      this.unload();
      this.load(siteKey, options);
    } else if (this.isBadgeVisibilityChanged(options)) {
      this.setBadgeVisibility(options?.badgeHidden);
    }
    this.options = options;
  }

  private load(siteKey: string, options?: NgxRecaptchaOptions): void {
    const script: HTMLScriptElement = document.createElement('script');
    script.src = `${RECAPTCHA_GOOGLE_URL}/api.js?render=${siteKey}&onload=scriptLoaded${
      options?.language ? `&hl=${options?.language}` : ''
    }`;
    script.async = true;
    script.defer = true;

    window.scriptLoaded = () => {
      this.setBadgeVisibility(this.options?.badgeHidden);
      this.scriptLoadedSubject.next(true);
    };

    this.document.body.insertBefore(script, this.document.body.lastChild);
  }

  private setBadgeVisibility(hidden?: boolean): void {
    (this.document.getElementsByClassName(RECAPTCHA_BADGE_CLASS)[0] as HTMLElement).style.display = hidden ? 'none' : 'block';
  }

  private removeBadge(): void {
    const badgeCollection = this.document.getElementsByClassName(RECAPTCHA_BADGE_CLASS);
    Array.from(badgeCollection).forEach((badge) => {
      const badgeNode = badge.parentNode;
      if (badgeNode) {
        document.body.removeChild(badgeNode);
      }
    });
  }

  private removeScripts(): void {
    this.document.querySelector(`script[src*="${RECAPTCHA_GOOGLE_URL}"]`)?.remove();
    this.document.querySelector(`script[src*="${RECAPTCHA_GSTATIC_URL}"]`)?.remove();
  }
}
