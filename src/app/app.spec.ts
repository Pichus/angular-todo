import { provideNativeDateAdapter } from '@angular/material/core';
import { TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { App } from './app';
import { tasksFeature } from './store/tasks.reducer';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideNativeDateAdapter(),
        provideStore({ [tasksFeature.name]: tasksFeature.reducer }),
        provideEffects([]),
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
