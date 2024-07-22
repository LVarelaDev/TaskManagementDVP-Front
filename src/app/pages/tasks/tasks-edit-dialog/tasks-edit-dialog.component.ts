import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  TaskDTO,
  UpdatePayload,
  UsersSelectDTO,
} from '../../../models/TaskModelst';
import { TaskService } from '../../../services/task.service';
import { ToastrService } from 'ngx-toastr';
import { userDto } from '../../../models/authModels';

interface DatosDialog {
  task: TaskDTO;
  session: userDto;
}

@Component({
  selector: 'app-tasks-edit-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './tasks-edit-dialog.component.html',
  styleUrl: './tasks-edit-dialog.component.scss',
})
export class TasksEditDialogComponent implements OnInit {
  task!: TaskDTO;

  formData: FormGroup;

  employes: UsersSelectDTO[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TasksEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DatosDialog,
    private taskService: TaskService,
    private toastr: ToastrService
  ) {
    this.task = data.task;

    this.formData = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      type: ['', [Validators.required]],
      employe: ['', [Validators.required]],
      status: ['', [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getEmployes();
    this.setValues();
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

  setValues() {
    this.formData.controls['title'].setValue(this.task.title);
    this.formData.controls['description'].setValue(this.task.description);
    this.formData.controls['type'].setValue(this.task.type);
    this.formData.controls['employe'].setValue(this.task.assignedUserId);
    this.formData.controls['status'].setValue(this.task.statusId);
    this.formData.controls['startDate'].setValue(this.task.startDate);
    this.formData.controls['endDate'].setValue(this.task.endDate);
  }

  editTask() {
    const payload: UpdatePayload = {
      code: this.task.code,
      title: this.formData.controls['title'].value,
      description: this.formData.controls['description'].value,
      type: this.formData.controls['type'].value,
      assignedUserId: this.formData.controls['employe'].value,
      status: this.formData.controls['status'].value,
      user: this.data.session?.username ?? 'WebSite',
    };

    this.taskService.updateTask(payload).subscribe({
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
