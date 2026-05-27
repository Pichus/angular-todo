import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCalendarCellClassFunction, MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Task } from '../../store/task.model';
import { TasksActions } from '../../store/tasks.actions';
import { selectAllTasks } from '../../store/tasks.selectors';
import { TaskFormDialogComponent } from '../task-form-dialog/task-form-dialog';
import { TaskItemComponent } from '../task-item/task-item';

@Component({
  selector: 'app-task-calendar',
  imports: [MatDatepickerModule, MatButtonModule, TaskItemComponent, DatePipe],
  templateUrl: './task-calendar.html',
  styleUrl: './task-calendar.scss',
})
export class TaskCalendarComponent {
  private store = inject(Store);
  private dialog = inject(MatDialog);

  tasks = toSignal(this.store.select(selectAllTasks), { initialValue: [] });
  selectedDate = signal<Date | null>(null);

  tasksForDate = computed(() => {
    const date = this.selectedDate();
    if (!date) return [];
    const dateStr = this.toDateStr(date);
    return this.tasks().filter((t) => t.dueDate === dateStr);
  });

  dateClass = computed((): MatCalendarCellClassFunction<Date> => {
    const taskDates = new Set(this.tasks().filter((t) => t.dueDate).map((t) => t.dueDate!));
    return (date: Date) => (taskDates.has(this.toDateStr(date)) ? 'has-tasks' : '');
  });

  openEdit(task: Task): void {
    this.dialog.open(TaskFormDialogComponent, { data: task });
  }

  delete(id: string): void {
    this.store.dispatch(TasksActions.deleteTask({ id }));
  }

  private toDateStr(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
