import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Task } from '../../store/task.model';
import { TasksActions } from '../../store/tasks.actions';
import { selectFilteredTasks } from '../../store/tasks.selectors';
import { TaskFiltersComponent } from '../task-filters/task-filters';
import { TaskFormDialogComponent } from '../task-form-dialog/task-form-dialog';
import { TaskItemComponent } from '../task-item/task-item';

@Component({
  selector: 'app-task-list',
  imports: [MatButtonModule, MatIconModule, TaskItemComponent, TaskFiltersComponent],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskListComponent {
  private store = inject(Store);
  private dialog = inject(MatDialog);

  tasks = toSignal(this.store.select(selectFilteredTasks), { initialValue: [] });

  openCreate(): void {
    this.dialog.open(TaskFormDialogComponent);
  }

  openEdit(task: Task): void {
    this.dialog.open(TaskFormDialogComponent, { data: task });
  }

  delete(id: string): void {
    this.store.dispatch(TasksActions.deleteTask({ id }));
  }
}
