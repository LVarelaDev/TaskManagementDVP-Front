import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskService } from '../../../services/task.service';
import { ToastrService } from 'ngx-toastr';
import { PayloadCreateTask, UsersSelectDTO } from '../../../models/TaskModelst';
import { userDto } from '../../../models/authModels';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

interface DatosDialog {
  session: userDto;
}

@Component({
  selector: 'app-tasks-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, FontAwesomeModule],
  templateUrl: './tasks-form-dialog.component.html',
  styleUrl: './tasks-form-dialog.component.scss',
})
export class TasksFormDialogComponent implements OnInit {
  session?: userDto;
  formData: FormGroup;

  employes: UsersSelectDTO[] = [];

  iconAlert = faCircleInfo;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TasksFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DatosDialog,
    private taskService: TaskService,
    private toastr: ToastrService
  ) {
    const session = localStorage.getItem('user');
    this.session = JSON.parse(session ?? '');

    this.formData = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      type: ['', [Validators.required]],
      employe: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getEmployes();
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

  createTask(): void {
    const payload: PayloadCreateTask = {
      title: this.formData.controls['title'].value,
      description: this.formData.controls['description'].value,
      type: this.formData.controls['type'].value,
      assignedUserId: this.formData.controls['employe'].value,
      user: this.session?.username ?? 'WebSite',
    };

    this.taskService.createTask(payload).subscribe({
      next: (response) => {
        if (response.key == 0) {
          this.toastr.success(response.value);
          this.closeDialog();
        } else {
          this.toastr.error(response.value);
        }
      },
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
