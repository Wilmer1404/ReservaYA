import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InstitutionService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/institution';

  getSettings() {
    return this.http.get<any>(`${this.apiUrl}/my-institution`);
  }

  updateSettings(data: any) {
    return this.http.put(`${this.apiUrl}/my-institution`, data);
  }
}
