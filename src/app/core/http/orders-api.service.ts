import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseOrderDTO } from '../models/order';
import { ResponseOrderItemDTO } from '../models/order-item';

@Injectable({
  providedIn: 'root',
})
export class OrdersApiService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<ResponseOrderDTO[]> {
    return this.http.get<ResponseOrderDTO[]>(`orders`);
  }

  create(order: ResponseOrderDTO): Observable<any> {
    return this.http.post(`orders`, order);
  }

  getItemsByIdOrder(
    id: ResponseOrderDTO['id']
  ): Observable<ResponseOrderItemDTO[]> {
    return this.http.get<ResponseOrderItemDTO[]>(`orders/${id}/items`);
  }
}
