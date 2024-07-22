import { Component, Inject, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { UserDto, userFilters } from '../../models/userModels';
import {
  faMagnifyingGlass,
  faSpinner,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { PaginatorData, PaginatorResponse } from '../../models/paginatorModels';
import { PaginatorComponent } from '../../shared/ui/paginator/paginator.component';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { UserEditDialogComponent } from './user-edit-dialog/user-edit-dialog.component';
import { userDto } from '../../models/authModels';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    PaginatorComponent,
    CommonModule,
    MatDialogModule,
    RouterLink,
    RouterOutlet,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  session?: userDto;
  pageIndex: number = 1;
  pageSize: number = 5;
  userPaginated?: PaginatorResponse<UserDto>;
  paginatorData?: PaginatorData;
  iconLoading = faSpinner;
  iconEdit = faPenToSquare;
  iconDelete = faTrashCan;
  iconSearch = faMagnifyingGlass;
  form: FormGroup;

  formBuilder = inject(FormBuilder);
  router = inject(Router);
  dialog = inject(MatDialog);
  userService = inject(UserService);
  toastr = inject(ToastrService);

  constructor() {
    const session = localStorage.getItem('user');
    this.session = JSON.parse(session ?? '');

    this.form = this.formBuilder.group({
      search: [''],
    });
  }

  ngOnInit(): void {
    this.getUsers(this.pageIndex, this.pageSize);

    this.form.controls['search'].valueChanges.subscribe((data) => {
      if (data === '') {
        this.getUsers(this.pageIndex, this.pageSize);
      } else {
        const filter: userFilters = {
          searchValue: data,
        };
        this.getUsers(this.pageIndex, this.pageSize, filter);
      }
    });
  }

  getUsers(
    pageIndex: number,
    pageSize: number,
    filters: userFilters | null = null
  ): void {
    this.userService.getUsers(pageIndex, pageSize, filters).subscribe({
      next: (response) => {
        this.userPaginated = response;
        this.paginatorData = {
          currentPage: response.currentPage,
          pageSize: response.pageSize,
          totalPages: response.totalPages,
          totalRecords: response.totalRecords,
        };
      },
      error: (err) => {
        this.toastr.error('Ocurrió un error al obtener la lista de usuarios');
      },
    });
  }

  paginator(event: number): void {
    this.getUsers(event, this.pageSize);
  }

  getRolName(rolId: number): string {
    switch (rolId) {
      case 1:
        return 'Administrador';
      case 2:
        return 'Supervisor';
      case 3:
        return 'Empleado';
      default:
        return '';
    }
  }

  navigateUrl(url: string): void {
    this.router.navigateByUrl(url);
  }

  openDialogUser(userDto: UserDto): void {
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      width: '50%',
      data: {
        session: this.session,
        user: userDto,
      },
    });

    dialogRef.afterClosed().subscribe((x) => {
      this.getUsers(this.pageIndex, this.pageSize);
    });
  }

  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe({
      next: (response) => {
        if (response.key === 0) {
          this.toastr.success(response.value);
          this.getUsers(this.pageIndex, this.pageSize);
        } else {
          this.toastr.error(response.value);
        }
      },
    });
  }
}
