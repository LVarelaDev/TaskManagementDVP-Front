import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { TasksComponent } from './pages/tasks/tasks.component';
import { authGuard } from './customs/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { UsersComponent } from './pages/users/users.component';
import { CreateComponent } from './pages/users/create/create/create.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard],
    children: [
      { path: 'tasks', component: TasksComponent },
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'users/create',
        component: CreateComponent,
      },
    ],
  },
];
