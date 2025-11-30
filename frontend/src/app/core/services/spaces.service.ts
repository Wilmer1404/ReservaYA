import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SpacesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/v1/spaces';

  getAll() {
    return this.http.get<any[]>(this.apiUrl);
  }

  create(payload: any) {
    return this.http.post(this.apiUrl, payload);
  }

  update(id: number, payload: any) {
    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
