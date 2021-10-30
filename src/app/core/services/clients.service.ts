import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { ClientsApiService } from '../http/clients-api.service';
import { ResponseClientDTO } from '../models/client';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private clientList = new BehaviorSubject<ResponseClientDTO[]>([]);
  clientList$ = this.clientList.asObservable();

  constructor(private clientsApiService: ClientsApiService) {}

  setClientList(data: ResponseClientDTO[]) {
    this.clientList.next(data);
  }

  getClientList() {
    this.clientsApiService.getAll().subscribe(
      (data) => {
        this.setClientList(data);
      },
      (_err) => {
        console.error(_err);
      }
    );
  }
  saveClient(client: ResponseClientDTO): Promise<void> {
    return new Promise((resolve) => {
      this.clientsApiService
        .create(client)
        .pipe(take(1))
        .subscribe(
          () => {
            console.log('Registro salvo');
          },
          (_err) => {
            console.error(_err);
          },
          () => {
            resolve();
          }
        );
    });
  }

  updateClient(
    id: ResponseClientDTO['id'],
    client: ResponseClientDTO
  ): Promise<void> {
    return new Promise((resolve) => {
      this.clientsApiService
        .update(id, client)
        .pipe(take(1))
        .subscribe(
          () => {
            console.log('Registro atualizado');
          },
          (_err) => {
            console.error(_err);
          },
          () => {
            resolve();
          }
        );
    });
  }

  deleteClient(id: ResponseClientDTO['id']): Promise<void> {
    return new Promise((resolve) => {
      this.clientsApiService
        .delete(id)
        .pipe(take(1))
        .subscribe(
          () => {
            console.log('Registro removido');
          },
          (_err) => {
            console.error(_err);
          },
          () => {
            resolve();
          }
        );
    });
  }
}
