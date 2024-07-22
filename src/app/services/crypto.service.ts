import { Injectable } from '@angular/core';
import { AES, enc, mode, pad } from 'crypto-js';
import { appsettings } from '../settings/appSettings';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {

  private key = enc.Utf8.parse(appsettings.cryptoKey);
  private iv = enc.Utf8.parse(appsettings.crptoIV);

  encrypt(data: any): string {
    const jsonString = JSON.stringify(data);
    const encrypted = AES.encrypt(jsonString, this.key, {
      iv: this.iv,
      mode: mode.CBC,
      padding: pad.Pkcs7
    });
    const reponse = encrypted.ciphertext.toString(enc.Base64);
    return reponse;
  }

}
