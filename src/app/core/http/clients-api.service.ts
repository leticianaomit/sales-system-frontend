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

  create(client: ResponseClientDTO): Observable<any> {
    return this.http.post(`clients`, client);
  }

  update(
    id: ResponseClientDTO['id'],
    client: ResponseClientDTO
  ): Observable<any> {
    return this.http.patch(`clients/${id}`, client);
  }

  delete(id: ResponseClientDTO['id']): Observable<any> {
    return this.http.delete(`clients/${id}`);
  }
}
