import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { selectTaskById } from '../../store/tasks.selectors';
import { TaskFormDialogComponent } from '../task-form-dialog/task-form-dialog';

@Component({
  selector: 'app-task-detail-dialog',
  imports: [DatePipe, MatDialogModule, MatButtonModule],
  templateUrl: './task-detail-dialog.html',
  styleUrl: './task-detail-dialog.scss',
})
export class TaskDetailDialogComponent {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private dialogRef = inject(MatDialogRef<TaskDetailDialogComponent>);
  private taskId: string = inject(MAT_DIALOG_DATA);

  task = toSignal(this.store.select(selectTaskById(this.taskId)));

  openEdit(): void {
    const task = this.task();
    if (!task) return;
    this.dialogRef.close();
    this.dialog.open(TaskFormDialogComponent, { data: task });
  }
}
