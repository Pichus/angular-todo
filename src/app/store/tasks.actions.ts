import { createActionGroup, props } from '@ngrx/store';
import { FilterState, Task } from './task.model';

export const TasksActions = createActionGroup({
  source: 'Tasks',
  events: {
    'Add Task': props<{ task: Omit<Task, 'id'> }>(),
    'Update Task': props<{ task: Task }>(),
    'Delete Task': props<{ id: string }>(),
    'Set Filter': props<{ filter: Partial<FilterState> }>(),
  },
});
