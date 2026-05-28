import { DatePipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { TASK_STATUSES, Task, TaskStatus } from '../../store/task.model';
import { TasksActions } from '../../store/tasks.actions';

@Component({
  selector: 'app-task-item',
  imports: [MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatSelectModule, DatePipe],
  templateUrl: './task-item.html',
  styleUrl: './task-item.scss',
})
export class TaskItemComponent {
  private readonly store = inject(Store);

  public task = input.required<Task>();
  public isSelected = input<boolean>(false);
  public edit = output<Task>();
  public delete = output<string>();
  public view = output<Task>();
  public selectedChange = output<boolean>();

  public statuses: TaskStatus[] = TASK_STATUSES;

  public onStatusChange(status: TaskStatus): void {
    this.store.dispatch(TasksActions.updateTask({ task: { ...this.task(), status } }));
  }
}
