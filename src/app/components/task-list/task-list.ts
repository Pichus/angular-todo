import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Task } from '../../store/task.model';
import { TasksActions } from '../../store/tasks.actions';
import { selectFilteredTasks } from '../../store/tasks.selectors';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog';
import { TaskDetailDialogComponent } from '../task-detail-dialog/task-detail-dialog';
import { TaskFiltersComponent } from '../task-filters/task-filters';
import { TaskFormDialogComponent } from '../task-form-dialog/task-form-dialog';
import { TaskItemComponent } from '../task-item/task-item';

@Component({
  selector: 'app-task-list',
  imports: [MatButtonModule, MatCheckboxModule, MatIconModule, TaskItemComponent, TaskFiltersComponent],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskListComponent {
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);

  public tasks = toSignal(this.store.select(selectFilteredTasks), { initialValue: [] });
  public selectedIds = signal<Set<string>>(new Set());

  public allSelected = computed(() => {
    const tasks = this.tasks();
    return tasks.length > 0 && tasks.every((t) => this.selectedIds().has(t.id));
  });

  public openCreate(): void {
    this.dialog.open(TaskFormDialogComponent);
  }

  public openEdit(task: Task): void {
    this.dialog.open(TaskFormDialogComponent, { data: task });
  }

  public confirmDelete(id: string): void {
    this.dialog
      .open(ConfirmDialogComponent, { data: { message: 'Delete this task?' } })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) this.store.dispatch(TasksActions.deleteTask({ id }));
      });
  }

  public deleteSelected(): void {
    const ids = [...this.selectedIds()];
    this.dialog
      .open(ConfirmDialogComponent, {
        data: { message: `Delete ${ids.length} task${ids.length > 1 ? 's' : ''}?` },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.store.dispatch(TasksActions.deleteManyTasks({ ids }));
          this.selectedIds.set(new Set());
        }
      });
  }

  public openDetail(task: Task): void {
    this.dialog.open(TaskDetailDialogComponent, { data: task.id, width: '500px', maxWidth: '95vw' });
  }

  public toggleSelectAll(): void {
    if (this.allSelected()) {
      this.selectedIds.set(new Set());
    } else {
      this.selectedIds.set(new Set(this.tasks().map((t) => t.id)));
    }
  }

  public onSelectionChange(taskId: string, checked: boolean): void {
    const set = new Set(this.selectedIds());
    if (checked) set.add(taskId);
    else set.delete(taskId);
    this.selectedIds.set(set);
  }
}
