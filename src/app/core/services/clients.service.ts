import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { ClientsApiService } from '../http/clients-api.service';
import { ResponseClientDTO } from '../models/client';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private singularText: string = '';
  private pluralText: string = '';

  private clientList = new BehaviorSubject<ResponseClientDTO[]>([]);
  clientList$ = this.clientList.asObservable();

  constructor(
    private clientsApiService: ClientsApiService,
    private snackbarService: SnackbarService,
    public translate: TranslateService
  ) {
    this.translate
      .get('CLIENTS.TITLE_SINGLE')
      .pipe(take(1))
      .subscribe((res) => {
        this.singularText = res;
      });
    this.translate
      .get('CLIENTS.TITLE')
      .pipe(take(1))
      .subscribe((res) => {
        this.pluralText = res;
      });
  }

  setClientList(data: ResponseClientDTO[]) {
    this.clientList.next(data);
  }

  getClientList() {
    this.clientsApiService.getAll().subscribe(
      (data) => {
        this.setClientList(data);
      },
      (_err) => {
        this.snackbarService.showFailureSnackbar(
          'CRUD_MESSAGES.READ.FAILURE_PLURAL',
          {
            type: this.pluralText.toLowerCase(),
          }
        );
      }
    );
  }

  saveClient(client: ResponseClientDTO): Promise<void> {
    return new Promise((resolve) => {
      this.clientsApiService
        .create(client)
        .pipe(take(1))
        .subscribe(
          async () => {
            this.snackbarService.showSuccessSnackbar(
              'CRUD_MESSAGES.CREATE.SUCCESS',
              {
                type: this.singularText,
              }
            );
          },
          async (_err) => {
            this.snackbarService.showFailureSnackbar(
              'CRUD_MESSAGES.CREATE.FAILURE',
              {
                type: this.singularText.toLowerCase(),
              }
            );
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
            this.snackbarService.showSuccessSnackbar(
              'CRUD_MESSAGES.UPDATE.SUCCESS',
              {
                type: this.singularText,
              }
            );
          },
          (_err) => {
            this.snackbarService.showFailureSnackbar(
              'CRUD_MESSAGES.UPDATE.FAILURE',
              {
                type: this.singularText.toLowerCase(),
              }
            );
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
            this.snackbarService.showSuccessSnackbar(
              'CRUD_MESSAGES.DELETE.SUCCESS',
              {
                type: this.singularText,
              }
            );
          },
          (_err) => {
            this.snackbarService.showFailureSnackbar(
              'CRUD_MESSAGES.DELETE.FAILURE',
              {
                type: this.singularText.toLowerCase(),
              }
            );
          },
          () => {
            resolve();
          }
        );
    });
  }
}
