import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseClientDTO } from '../models/client';

@Injectable({
  providedIn: 'root',
})
export class ClientsApiService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<ResponseClientDTO[]> {
    return this.http.get<ResponseClientDTO[]>(`clients`);
  }

  create(contact: ResponseClientDTO): Observable<any> {
    return this.http.post(`clients`, contact);
  }

  update(
    id: ResponseClientDTO['id'],
    contact: ResponseClientDTO
  ): Observable<any> {
    return this.http.patch(`clients/${id}`, contact);
  }

  delete(id: ResponseClientDTO['id']): Observable<any> {
    return this.http.delete(`clients/${id}`);
  }
}
