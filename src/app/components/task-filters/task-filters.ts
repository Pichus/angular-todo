import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { TASK_STATUSES, TaskStatus } from '../../store/task.model';
import { TasksActions } from '../../store/tasks.actions';
import { selectFilter } from '../../store/tasks.selectors';

@Component({
  selector: 'app-task-filters',
  imports: [MatFormFieldModule, MatInputModule, MatButtonToggleModule, MatIconModule],
  templateUrl: './task-filters.html',
  styleUrl: './task-filters.scss',
})
export class TaskFiltersComponent {
  private readonly store = inject(Store);

  public filter = toSignal(this.store.select(selectFilter));
  public statuses: (TaskStatus | 'all')[] = ['all', ...TASK_STATUSES];

  public searchValue = computed(() => this.filter()?.search ?? '');
  public statusValue = computed(() => this.filter()?.status ?? 'all');

  public onSearchChange(event: Event): void {
    const search = (event.target as HTMLInputElement).value;
    this.store.dispatch(TasksActions.setFilter({ filter: { search } }));
  }

  public onStatusChange(status: TaskStatus | 'all'): void {
    this.store.dispatch(TasksActions.setFilter({ filter: { status } }));
  }
}
