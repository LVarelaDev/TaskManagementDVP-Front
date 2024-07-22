import { Component, Inject, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserService } from '../../../services/user.service';
import { userDto } from '../../../models/authModels';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  CreateUserPayload,
  UpdateUserPayload,
} from '../../../models/userModels';
import { ToastrService } from 'ngx-toastr';
import { UpdatePayload } from '../../../models/TaskModelst';

interface DatosDialog {
  session: userDto;
  user: userDto;
}

@Component({
  selector: 'app-user-edit-dialog',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './user-edit-dialog.component.html',
  styleUrl: './user-edit-dialog.component.scss',
})
export class UserEditDialogComponent implements OnInit {
  session?: userDto;
  form: FormGroup;
  loading: boolean = false;
  iconLoading = faSpinner;
  userService = inject(UserService);
  formBuilder = inject(FormBuilder);
  toastr = inject(ToastrService);

  roles = [
    { id: 1, name: 'Administrador' },
    { id: 2, name: 'Supervisor' },
    { id: 3, name: 'Empleado' },
  ];

  constructor(
    public dialogRef: MatDialogRef<UserEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DatosDialog
  ) {
    const session = localStorage.getItem('user');
    this.session = JSON.parse(session ?? '');

    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      rolId: [0, [Validators.required]],
    });
  }
  ngOnInit(): void {
    this.setValues();
  }

  setValues(): void {
    this.form.controls['name'].setValue(this.data.user.name);
    this.form.controls['lastName'].setValue(this.data.user.lastName);
    this.form.controls['username'].setValue(this.data.user.username);
    this.form.controls['email'].setValue(this.data.user.email);
    this.form.controls['rolId'].setValue(this.data.user.rolId);
  }

  updateUser(): void {
    const payload: UpdateUserPayload = {
      id: this.data.user.id,
      name: this.form.controls['name'].value,
      lastName: this.form.controls['lastName'].value,
      username: this.form.controls['username'].value,
      email: this.form.controls['email'].value,
      rolId: this.form.controls['rolId'].value,
      user: this.session?.username ?? 'Website',
    };

    this.userService.updateUser(payload).subscribe({
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
