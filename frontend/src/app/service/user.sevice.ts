import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({ providedIn: 'root' })
export class UserService {
  private base = '/api/users';
  constructor(private http: HttpClient) {}
  changePassword(payload: { currentPassword: string; newPassword: string }) {
    return this.http.patch(`${this.base}/change-password`, payload);
  }
}
