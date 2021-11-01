import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseProductDTO } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductsApiService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<ResponseProductDTO[]> {
    return this.http.get<ResponseProductDTO[]>(`products`);
  }

  create(product: ResponseProductDTO): Observable<any> {
    return this.http.post(`products`, product);
  }

  update(
    id: ResponseProductDTO['id'],
    product: ResponseProductDTO
  ): Observable<any> {
    return this.http.patch(`products/${id}`, product);
  }

  delete(id: ResponseProductDTO['id']): Observable<any> {
    return this.http.delete(`products/${id}`);
  }
}
