import { Component, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CryptoService } from '../../services/crypto.service';
import { LoginDTO } from '../../models/authModels';
import { ToastrService } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FontAwesomeModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  form: FormGroup;
  AuthService = inject(AuthService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  cryptoService = inject(CryptoService);
  toastr = inject(ToastrService);
  loading: boolean = false;
  iconLoading = faSpinner;

  constructor() {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    this.loading = true;
    const loginPayload: LoginDTO = {
      Username: this.form.controls['username'].value,
      Password: this.form.controls['password'].value,
    };

    this.AuthService.login(loginPayload).subscribe({
      next: (data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        this.loading = false;
        this.router.navigate(['/tasks']);
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error('Ocrrió un error en el proceso de login', 'Ups!');
      },
    });
  }
}
