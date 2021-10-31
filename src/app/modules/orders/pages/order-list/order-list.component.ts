import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent implements OnInit {
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

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {}

  onClickBtnAddOrder() {
    this.router.navigate(['add'], { relativeTo: this.route });
  }
}
