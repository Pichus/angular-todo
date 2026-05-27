import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { TASK_STATUSES, Task } from '../../store/task.model';
import { TasksActions } from '../../store/tasks.actions';

@Component({
  selector: 'app-task-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
  ],
  templateUrl: './task-form-dialog.html',
})
export class TaskFormDialogComponent {
  private store = inject(Store);
  private dialogRef = inject(MatDialogRef<TaskFormDialogComponent>);
  private fb = inject(FormBuilder);

  data: Task | null = inject(MAT_DIALOG_DATA, { optional: true });
  statuses = TASK_STATUSES;

  form = this.fb.group({
    title: [this.data?.title ?? '', Validators.required],
    status: [this.data?.status ?? 'todo'],
    dueDate: [this.data?.dueDate ? new Date(this.data.dueDate) : null as Date | null],
  });

  submit(): void {
    if (this.form.invalid) return;
    const { title, status, dueDate } = this.form.getRawValue();
    const taskData = {
      title: title!,
      status: status! as Task['status'],
      dueDate: dueDate ? dueDate.toISOString().split('T')[0] : null,
    };
    if (this.data) {
      this.store.dispatch(TasksActions.updateTask({ task: { ...this.data, ...taskData } }));
    } else {
      this.store.dispatch(TasksActions.addTask({ task: taskData }));
    }
    this.dialogRef.close();
  }
}
