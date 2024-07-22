import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserService } from '../../../../services/user.service';
import { Router, RouterLink } from '@angular/router';
import { CryptoService } from '../../../../services/crypto.service';
import { ToastrService } from 'ngx-toastr';
import { faCircleInfo, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { CreateUserPayload } from '../../../../models/userModels';
import { userDto } from '../../../../models/authModels';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, FontAwesomeModule, RouterLink],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent {
  session?: userDto;
  form: FormGroup;
  loading: boolean = false;
  iconLoading = faSpinner;
  iconAlert = faCircleInfo;

  userService = inject(UserService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  cryptoService = inject(CryptoService);
  toastr = inject(ToastrService);

  roles = [
    { id: 1, name: 'Administrador' },
    { id: 2, name: 'Supervisor' },
    { id: 3, name: 'Empleado' },
  ];

  constructor() {
    const session = localStorage.getItem('user');
    this.session = JSON.parse(session ?? '');

    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rolId: [0, [Validators.required]],
    });
  }

  createUser(): void {
    const payload: CreateUserPayload = {
      name: this.form.controls['name'].value,
      lastName: this.form.controls['lastName'].value,
      username: this.form.controls['username'].value,
      email: this.form.controls['email'].value,
      password: this.form.controls['password'].value,
      rolId: this.form.controls['rolId'].value,
      user: this.session?.username ?? 'Website',
    };

    this.userService.createUser(payload).subscribe({
      next: (response) => {
        if (response.key == 0) {
          this.toastr.success(response.value);
          this.router.navigate(['/users']);
        }
      },
      error: (err) => {
        this.toastr.error('Ocurrió un error al crear el usuario');
      },
    });
  }
}
