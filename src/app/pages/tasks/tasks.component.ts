import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { userDto } from '../../models/authModels';
import {
  TaskDTO,
  UpdateStatus,
  UsersSelectDTO,
} from '../../models/TaskModelst';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { enumTaskStatus } from '../../utils/enums/enums';
import { TasksEditDialogComponent } from './tasks-edit-dialog/tasks-edit-dialog.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TasksFormDialogComponent } from './tasks-form-dialog/tasks-form-dialog.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    FontAwesomeModule,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent implements OnInit {
  session?: userDto;
  authService = inject(AuthService);
  taskService = inject(TaskService);
  toastr = inject(ToastrService);

  TaskDTO: TaskDTO[] = [];
  TaskListPending: TaskDTO[] = [];
  TaskListInProgress: TaskDTO[] = [];
  TaskListCompleted: TaskDTO[] = [];

  iconSearch = faMagnifyingGlass;

  employes: UsersSelectDTO[] = [];

  form: FormGroup;
  taskForm: FormGroup;

  formBuilder = inject(FormBuilder);

  dialog = inject(MatDialog);

  selectedStatus: number = 0;
  selectedStatus1: number = 0;
  selectedStatus2: number = 0;


  listStatus = [
    { value: 1, description: 'Pendiente' },
    { value: 2, description: 'En Proceso' },
    { value: 3, description: 'Completado' },
  ];

  constructor() {
    const session = localStorage.getItem('user');
    this.session = JSON.parse(session ?? '');

    this.taskForm = new FormGroup({})

    this.form = this.formBuilder.group({
      search: [''],
    });
  }

  ngOnInit(): void {
    this.getAllTasks();
    this.getEmployes();

    this.form.controls['search'].valueChanges.subscribe((data) => {
      if (data === '') {
        this.getAllTasks();
      } else {
        this.taskService.getTaskByCodeAndTitle(data).subscribe({
          next: (response) => {
            this.TaskListPending = response.filter(
              (x) => x.statusId == enumTaskStatus.pending
            );
            this.TaskListInProgress = response.filter(
              (x) => x.statusId == enumTaskStatus.inProgress
            );
            this.TaskListCompleted = response.filter(
              (x) => x.statusId == enumTaskStatus.completed
            );
          },
        });
      }
    });
    
  }


  onStatusChange(event: Event, code: number) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.processStatusChange(selectedValue, code);
  }

  processStatusChange(value: string, code: number) {
    const payload: UpdateStatus = {
      code: code,
      status: Number(value),
    };
    this.taskService.updateStatus(payload).subscribe({
      next: (response) => {
        if (response.key == 0) {
          this.toastr.success(response.value);
          this.getAllTasks();
        } else {
          this.toastr.error(response.value);
        }
      },
    });
  }

  getNameAssignedUser(userid: number): string | undefined {
    const name = this.employes.find((x) => x.id === userid)?.name;
    const lastname = this.employes.find((x) => x.id === userid)?.lastName;

    if (userid === 0) {
      return 'No asignada';
    }

    return name + ' ' + lastname;
  }

  getAllTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (response) => {
        this.TaskDTO = response;
        this.TaskListPending = response.filter((x) => {
          if (this.session?.rolId == 3) {
            return (
              x.statusId == enumTaskStatus.pending &&
              x.assignedUserId == this.session.id
            );
          } else {
            return x.statusId == enumTaskStatus.pending;
          }
        });
        this.TaskListInProgress = response.filter((x) => {
          if (this.session?.rolId == 3) {
            return (
              x.statusId == enumTaskStatus.inProgress &&
              x.assignedUserId == this.session?.id
            );
          } else {
            return x.statusId == enumTaskStatus.inProgress;
          }
        });
        this.TaskListCompleted = response.filter((x) => {
          if (this.session?.rolId == 3) {
            return (
              x.statusId == enumTaskStatus.completed &&
              x.assignedUserId == this.session?.id
            );
          } else {
            return x.statusId == enumTaskStatus.completed;
          }
        });
      },
      error: (err) => {
        this.toastr.error('Ocrrió un error al obtener las tareas', 'Ups!');
      },
    });
  }

  getEmployes(): void {
    this.taskService.getEmployes().subscribe({
      next: (response) => {
        this.employes = response;
      },
      error: (err) => {
        this.toastr.error('Ocrrió un error al obtener las tareas', 'Ups!');
      },
    });
  }

  openDialogTask(task: TaskDTO): void {
    const dialogRef = this.dialog.open(TasksEditDialogComponent, {
      width: '50%',
      data: {
        task: task,
        session: this.session,
      },
    });

    dialogRef.afterClosed().subscribe((x) => {
      this.getAllTasks();
    });
  }

  openDialogTaskCreate(): void {
    const dialogRef = this.dialog.open(TasksFormDialogComponent, {
      width: '50%',
      data: {
        session: this.session,
      },
    });

    dialogRef.afterClosed().subscribe((x) => {
      this.getAllTasks();
    });
  }
}
