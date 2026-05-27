import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, withLatestFrom } from 'rxjs';
import { TasksActions } from './tasks.actions';
import { selectAllTasks } from './tasks.selectors';

@Injectable()
export class TasksEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);

  persistTasks$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          TasksActions.addTask,
          TasksActions.updateTask,
          TasksActions.deleteTask,
          TasksActions.deleteManyTasks,
        ),
        withLatestFrom(this.store.select(selectAllTasks)),
        tap(([, tasks]) => localStorage.setItem('tasks', JSON.stringify(tasks))),
      ),
    { dispatch: false },
  );
}
