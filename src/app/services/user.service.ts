import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateUserPayload,
  UpdateUserPayload,
  UserDto,
  userFilters,
} from '../models/userModels';
import { appsettings } from '../settings/appSettings';
import { PaginatorResponse } from '../models/paginatorModels';
import { KeyValuesResponse } from '../models/KeyValuesResponse';
import { UpdatePayload } from '../models/TaskModelst';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  http = inject(HttpClient);

  getUsers(
    pageIndex: number,
    pageSize: number,
    filters: userFilters | null
  ): Observable<PaginatorResponse<UserDto>> {
    const payload = {
      pageIndex: pageIndex,
      pageSize: pageSize,
      filters: filters,
    };
    return this.http.post<PaginatorResponse<UserDto>>(
      `${appsettings.apiUrl}/Users/GetUserPaginated`,
      payload
    );
  }

  createUser(payload: CreateUserPayload): Observable<KeyValuesResponse> {
    return this.http.post<KeyValuesResponse>(
      `${appsettings.apiUrl}/Users/CreateUser`,
      payload
    );
  }

  updateUser(payload: UpdateUserPayload): Observable<KeyValuesResponse> {
    return this.http.put<KeyValuesResponse>(
      `${appsettings.apiUrl}/Users/UpdateUser`,
      payload
    );
  }

  deleteUser(id: number): Observable<KeyValuesResponse> {
    return this.http.delete<KeyValuesResponse>(
      `${appsettings.apiUrl}/Users/DeleteUser?id=${id}`
    );
  }
}
