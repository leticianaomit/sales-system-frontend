import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { take, skip, startWith, map } from 'rxjs/operators';
import { ResponseClientDTO } from 'src/app/core/models/client';
import { ClientsService } from 'src/app/core/services/clients.service';
import { OrderItemFormComponent } from '../../components/order-item-form/order-item-form.component';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
})
export class OrderFormComponent implements OnInit {
  productTableColumns: any = [
    {
      label: 'PRODUCTS.FORM.NAME',
      property: 'name',
      type: 'text',
    },
    {
      property: 'id',
      type: 'actions',
    },
  ];
  displayedProductColumns = ['name', 'price', 'quantity'];

  orderControl = new FormControl();
  orderForm: FormGroup = this.fb.group({
    client: [null, Validators.required],
  });
  clientList: ResponseClientDTO[] = [];
  filteredClients!: ResponseClientDTO[];

  orderControlSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private clientsService: ClientsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadClients();

    this.orderControlSubscription = this.orderControl.valueChanges
      .pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.name)),
        map((name) =>
          name ? this._filterByClientName(name) : this.clientList.slice()
        )
      )
      .subscribe((res) => {
        this.filteredClients = res;
      });
  }

  ngOnDestroy(): void {
    this.orderControlSubscription?.unsubscribe();
  }

  loadClients() {
    this.clientsService.getClientList();
    this.clientsService.clientList$.pipe(skip(1), take(1)).subscribe((res) => {
      this.clientList = res;
      this.filteredClients = res;
    });
  }

  getClientName(client: ResponseClientDTO): string {
    return client?.name ? client.name : '';
  }

  private _filterByClientName(name: string): ResponseClientDTO[] {
    const filterValue = name.toLowerCase();

    return this.clientList.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  onClickBtnAddItem() {
    this.dialog.open(OrderItemFormComponent, {
      width: '600px',
      autoFocus: false,
    });
  }
}
