import { describe, expect, it } from 'vitest';
import { Task } from './task.model';
import { TasksActions } from './tasks.actions';
import { TasksState, tasksFeature } from './tasks.reducer';

const reducer = tasksFeature.reducer;

const baseState: TasksState = {
  tasks: [],
  filter: { search: '', status: 'all' },
};

const mockTask: Task = { id: '1', title: 'Test task', status: 'todo', dueDate: null };

describe('tasks reducer', () => {
  it('adds a task with generated id', () => {
    const state = reducer(
      baseState,
      TasksActions.addTask({ task: { title: 'New', status: 'todo', dueDate: null } }),
    );
    expect(state.tasks).toHaveLength(1);
    expect(state.tasks[0].title).toBe('New');
    expect(state.tasks[0].id).toBeTruthy();
  });

  it('updates a task by id', () => {
    const state = reducer(
      { ...baseState, tasks: [mockTask] },
      TasksActions.updateTask({ task: { ...mockTask, title: 'Updated' } }),
    );
    expect(state.tasks[0].title).toBe('Updated');
  });

  it('does not mutate other tasks on update', () => {
    const other: Task = { id: '2', title: 'Other', status: 'done', dueDate: null };
    const state = reducer(
      { ...baseState, tasks: [mockTask, other] },
      TasksActions.updateTask({ task: { ...mockTask, title: 'Updated' } }),
    );
    expect(state.tasks[1].title).toBe('Other');
  });

  it('deletes a task by id', () => {
    const state = reducer(
      { ...baseState, tasks: [mockTask] },
      TasksActions.deleteTask({ id: '1' }),
    );
    expect(state.tasks).toHaveLength(0);
  });

  it('sets filter search', () => {
    const state = reducer(baseState, TasksActions.setFilter({ filter: { search: 'foo' } }));
    expect(state.filter.search).toBe('foo');
    expect(state.filter.status).toBe('all');
  });

  it('sets filter status', () => {
    const state = reducer(baseState, TasksActions.setFilter({ filter: { status: 'done' } }));
    expect(state.filter.status).toBe('done');
    expect(state.filter.search).toBe('');
  });
});
