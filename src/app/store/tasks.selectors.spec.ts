import { describe, expect, it } from 'vitest';
import { Task } from './task.model';
import { selectFilteredTasks } from './tasks.selectors';

const tasks: Task[] = [
  { id: '1', title: 'Buy milk', description: null, status: 'todo', dueDate: null },
  { id: '2', title: 'Write code', description: 'Implement feature X', status: 'in-progress', dueDate: null },
  { id: '3', title: 'Deploy app', description: null, status: 'done', dueDate: null },
];

const select = (search: string, status: 'all' | Task['status']) =>
  selectFilteredTasks.projector(tasks, { search, status });

describe('selectFilteredTasks', () => {
  it('returns all tasks when filter is empty', () => {
    expect(select('', 'all')).toHaveLength(3);
  });

  it('filters by search (case-insensitive)', () => {
    expect(select('MILK', 'all')).toHaveLength(1);
    expect(select('MILK', 'all')[0].id).toBe('1');
  });

  it('filters by status', () => {
    expect(select('', 'done')).toHaveLength(1);
    expect(select('', 'done')[0].title).toBe('Deploy app');
  });

  it('filters by search and status combined', () => {
    expect(select('code', 'in-progress')).toHaveLength(1);
    expect(select('code', 'done')).toHaveLength(0);
  });

  it('returns empty when no match', () => {
    expect(select('xyz', 'all')).toHaveLength(0);
  });
});
