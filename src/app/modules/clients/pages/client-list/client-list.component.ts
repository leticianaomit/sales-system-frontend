import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
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

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.dataSource.data = [];
  }

  onClickBtnAddClient() {
    this.dialog.open(ClientFormComponent, {
      width: '600px',
      autoFocus: false,
    });
  }
}
