import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SpaceService {
  private base = '/api/spaces';
  constructor(private http: HttpClient) {}
  getSpaces(): Observable<any> {
    return this.http.get(this.base);
  }
}
