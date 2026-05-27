import { createSelector } from '@ngrx/store';
import { tasksFeature } from './tasks.reducer';

export const selectAllTasks = tasksFeature.selectTasks;
export const selectFilter = tasksFeature.selectFilter;

export const selectFilteredTasks = createSelector(
  selectAllTasks,
  selectFilter,
  (tasks, filter) =>
    tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(filter.search.toLowerCase());
      const matchesStatus =
        filter.status === 'all' || task.status === filter.status;
      return matchesSearch && matchesStatus;
    }),
);
