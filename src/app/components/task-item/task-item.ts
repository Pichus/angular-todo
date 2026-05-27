import { DatePipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { TASK_STATUSES, Task, TaskStatus } from '../../store/task.model';
import { TasksActions } from '../../store/tasks.actions';

@Component({
  selector: 'app-task-item',
  imports: [MatButtonModule, MatIconModule, MatSelectModule, DatePipe],
  templateUrl: './task-item.html',
  styleUrl: './task-item.scss',
})
export class TaskItemComponent {
  private store = inject(Store);

  task = input.required<Task>();
  edit = output<Task>();
  delete = output<string>();

  statuses: TaskStatus[] = TASK_STATUSES;

  onStatusChange(status: TaskStatus): void {
    this.store.dispatch(TasksActions.updateTask({ task: { ...this.task(), status } }));
  }
}
