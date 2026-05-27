import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { routes } from './app.routes';
import { tasksFeature } from './store/tasks.reducer';
import { TasksEffects } from './store/tasks.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideNativeDateAdapter(),
    provideStore({ [tasksFeature.name]: tasksFeature.reducer }),
    provideEffects([TasksEffects]),
  ],
};
