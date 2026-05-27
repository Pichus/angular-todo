import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TaskCalendarComponent } from './components/task-calendar/task-calendar';
import { TaskListComponent } from './components/task-list/task-list';

@Component({
  selector: 'app-root',
  imports: [MatToolbarModule, MatTabsModule, TaskListComponent, TaskCalendarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
