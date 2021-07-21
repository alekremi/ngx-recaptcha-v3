declare global {
  export interface Window {
    scriptLoaded: () => void;
  }
}

export interface NgxRecaptchaV3Api {
  execute(siteKey: string, params: { action: string }): Promise<string>;
}

export interface NgxRecaptchaV3Window extends Window {
  grecaptcha: NgxRecaptchaV3Api;
}

export interface NgxRecaptchaOptions {
  language?: string;
  badgeHidden?: boolean;
}
