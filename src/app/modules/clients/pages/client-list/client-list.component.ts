import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ResponseClientDTO } from 'src/app/core/models/client';
import { ClientsService } from 'src/app/core/services/clients.service';
import { DialogDeleteComponent } from 'src/app/shared/components/dialog-delete/dialog-delete.component';
import { ClientFormComponent } from '../../components/client-form/client-form.component';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss'],
})
export class ClientListComponent implements OnInit {
  tableColumns: any = [
    {
      label: 'Nome', //TODO: Add translate
      property: 'name',
      type: 'text',
    },
    {
      property: 'id',
      type: 'actions',
    },
  ];
  displayedColumns: string[] = ['name', 'id'];
  dataSource = new MatTableDataSource<any>();
  pageSizeOptions = [10, 20, 50, 100];

  clientListSubscription!: Subscription;
  dialogSubscription!: Subscription;

  constructor(
    private dialog: MatDialog,
    private clientsService: ClientsService
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  ngOnDestroy(): void {
    this.clientListSubscription?.unsubscribe();
  }

  loadClients() {
    this.clientsService.getClientList();
    this.clientListSubscription = this.clientsService.clientList$.subscribe(
      (data) => {
        console.log(data);

        this.dataSource.data = data;
      }
    );
  }

  onClickBtnAddClient() {
    this.dialog.open(ClientFormComponent, {
      width: '600px',
      autoFocus: false,
    });
  }

  onClickBtnEditClient(client: ResponseClientDTO) {
    this.dialog.open(ClientFormComponent, {
      data: client,
      width: '600px',
      autoFocus: false,
    });
  }

  onClickBtnDeleteClient(id: ResponseClientDTO['id']) {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '300px',
      autoFocus: false,
    });

    this.dialogSubscription?.unsubscribe();
    this.dialogSubscription =
      dialogRef.componentInstance.whenConfirmDelete.subscribe(() => {
        this.deleteClient(id);
      });
  }

  async deleteClient(id: string) {
    await this.clientsService.deleteClient(id);
    this.clientsService.getClientList();
    this.dialog.closeAll();
  }
}
