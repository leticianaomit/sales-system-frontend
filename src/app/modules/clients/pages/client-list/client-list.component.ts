import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ClientsService } from 'src/app/core/services/clients.service';
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
  ];
  displayedColumns: string[] = ['name'];
  dataSource = new MatTableDataSource<any>();
  pageSizeOptions = [10, 20, 50, 100];

  clientListSubscription!: Subscription;

  constructor(
    private dialog: MatDialog,
    private clientsService: ClientsService
  ) {}

  ngOnInit(): void {
    this.loadClients()
  }

  ngOnDestroy(): void {
    this.clientListSubscription?.unsubscribe();
  }

  loadClients() {
    this.clientsService.getClientList();
    this.clientListSubscription = this.clientsService.clientList$.subscribe(
      (data) => {
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
}
