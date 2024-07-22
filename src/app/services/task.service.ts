import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  PayloadCreateTask,
  TaskDTO,
  UpdatePayload,
  UpdateStatus,
  UsersSelectDTO,
} from '../models/TaskModelst';
import { appsettings } from '../settings/appSettings';
import { KeyValuesResponse } from '../models/KeyValuesResponse';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  http = inject(HttpClient);

  getAllTasks(): Observable<TaskDTO[]> {
    return this.http.get<TaskDTO[]>(`${appsettings.apiUrl}/Tasks/GetAllTasks`);
  }

  getEmployes(): Observable<UsersSelectDTO[]> {
    return this.http.get<UsersSelectDTO[]>(
      `${appsettings.apiUrl}/Tasks/GetEmployes`
    );
  }

  updateTask(payload: UpdatePayload): Observable<KeyValuesResponse> {
    return this.http.put<KeyValuesResponse>(
      `${appsettings.apiUrl}/Tasks/UpdateTask`,
      payload
    );
  }

  updateStatus(payload: UpdateStatus): Observable<KeyValuesResponse> {
    return this.http.put<KeyValuesResponse>(
      `${appsettings.apiUrl}/Tasks/UpdateStatusTask`,
      payload
    );
  }

  getTaskByCodeAndTitle(value: string): Observable<TaskDTO[]> {
    return this.http.get<TaskDTO[]>(
      `${appsettings.apiUrl}/Tasks/GetTaskByCodeAndTitle?searchValue=${value}`
    );
  }

  createTask(payload: PayloadCreateTask): Observable<KeyValuesResponse> {
    return this.http.post<KeyValuesResponse>(
      `${appsettings.apiUrl}/Tasks/CreateTask`,
      payload
    );
  }
}
