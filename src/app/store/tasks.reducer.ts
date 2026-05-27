import { createFeature, createReducer, on } from '@ngrx/store';
import { FilterState, Task } from './task.model';
import { TasksActions } from './tasks.actions';

export interface TasksState {
  tasks: Task[];
  filter: FilterState;
}

function loadTasks(): Task[] {
  try {
    const stored = localStorage.getItem('tasks');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

const initialState: TasksState = {
  tasks: loadTasks(),
  filter: { search: '', status: 'all' },
};

export const tasksFeature = createFeature({
  name: 'tasks',
  reducer: createReducer(
    initialState,
    on(TasksActions.addTask, (state, { task }) => ({
      ...state,
      tasks: [...state.tasks, { ...task, id: crypto.randomUUID() }],
    })),
    on(TasksActions.updateTask, (state, { task }) => ({
      ...state,
      tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
    })),
    on(TasksActions.deleteTask, (state, { id }) => ({
      ...state,
      tasks: state.tasks.filter((t) => t.id !== id),
    })),
    on(TasksActions.setFilter, (state, { filter }) => ({
      ...state,
      filter: { ...state.filter, ...filter },
    })),
  ),
});
