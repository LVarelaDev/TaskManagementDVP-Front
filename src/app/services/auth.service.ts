import { inject, Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginDTO, loginResponse, userDto } from '../models/authModels';
import { appsettings } from '../settings/appSettings';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  ActiveSession?: userDto;

  cryptoService = inject(CryptoService);
  http = inject(HttpClient);

  login(payload: LoginDTO): Observable<loginResponse> {
    const encypted = this.cryptoService.encrypt(payload);
    const payloadSend = {
      value: encypted,
    };
    return this.http.post<loginResponse>(
      `${appsettings.apiUrl}/AccessAcount/Login`,
      payloadSend
    );
  }
}
