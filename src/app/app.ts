import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TaskListComponent } from './components/task-list/task-list';

@Component({
  selector: 'app-root',
  imports: [MatToolbarModule, TaskListComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
