import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './customs/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
     providers: [
          provideRouter(routes),
          provideAnimationsAsync(),
          provideAnimations(),
          provideToastr(),
          importProvidersFrom(HttpClientModule),
          provideHttpClient(withInterceptors([authInterceptor])), provideAnimationsAsync()
     ]
};