import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { TASK_STATUSES, Task } from '../../store/task.model';
import { TasksActions } from '../../store/tasks.actions';

function futureDateValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selected = new Date(control.value);
  selected.setHours(0, 0, 0, 0);
  return selected >= today ? null : { pastDate: true };
}

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
  styleUrl: './task-form-dialog.scss',
})
export class TaskFormDialogComponent {
  private store = inject(Store);
  private dialogRef = inject(MatDialogRef<TaskFormDialogComponent>);
  private fb = inject(FormBuilder);

  data: Task | null = inject(MAT_DIALOG_DATA, { optional: true });
  statuses = TASK_STATUSES;
  readonly today = new Date();

  form = this.fb.group({
    title: [
      this.data?.title ?? '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    ],
    description: [
      this.data?.description ?? '',
      [Validators.maxLength(500)],
    ],
    status: [this.data?.status ?? 'todo'],
    dueDate: [
      this.data?.dueDate ? new Date(this.data.dueDate) : (null as Date | null),
      [futureDateValidator],
    ],
  });

  submit(): void {
    if (this.form.invalid) return;
    const { title, description, status, dueDate } = this.form.getRawValue();
    const taskData = {
      title: title!,
      description: description || null,
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
