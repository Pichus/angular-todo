import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
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
  if (!control.value) {
    return null;
  }
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
  private readonly store = inject(Store);
  private readonly dialogRef = inject(MatDialogRef<TaskFormDialogComponent>);
  private readonly formBuilder = inject(FormBuilder);

  public readonly data: Task | null = inject(MAT_DIALOG_DATA, { optional: true });
  public statuses = TASK_STATUSES;
  public readonly today = new Date();

  public readonly TITLE_MIN_LENGTH = 2;
  public readonly TITLE_MAX_LENGTH = 100;

  public readonly DESCRIPTION_MAX_LENGTH = 500;

  public form = this.formBuilder.group({
    title: [
      this.data?.title ?? '',
      [
        Validators.required,
        Validators.minLength(this.TITLE_MIN_LENGTH),
        Validators.maxLength(this.TITLE_MAX_LENGTH),
      ],
    ],
    description: [
      this.data?.description ?? '',
      [Validators.maxLength(this.DESCRIPTION_MAX_LENGTH)],
    ],
    status: [this.data?.status ?? 'todo'],
    dueDate: [
      this.data?.dueDate ? new Date(this.data.dueDate) : (null as Date | null),
      [futureDateValidator],
    ],
  });

  public get dialogTitle(): string {
    return this.data ? 'Edit Task' : 'New Task';
  }

  public get titleControl() {
    return this.form.controls.title;
  }

  public get descriptionControl() {
    return this.form.controls.description;
  }

  public get dueDateControl() {
    return this.form.controls.dueDate;
  }

  public get titleLength(): number {
    return this.titleControl.value?.length ?? 0;
  }

  public get titleAtLimit(): boolean {
    return this.titleLength >= this.TITLE_MAX_LENGTH;
  }

  public get descriptionLength(): number {
    return this.descriptionControl.value?.length ?? 0;
  }

  public get descriptionAtLimit(): boolean {
    return this.descriptionLength >= this.DESCRIPTION_MAX_LENGTH;
  }

  public get dueDateHasError(): boolean {
    return (
      this.dueDateControl.hasError('pastDate') ||
      this.dueDateControl.hasError('matDatepickerMin')
    );
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }
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
