import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  navItems = [
    { routerLink: '/clients', name: 'CLIENTS.TITLE', icon: 'person_outline' },
    { routerLink: '/products', name: 'PRODUCTS.TITLE', icon: 'list' },
    { routerLink: '/orders', name: 'ORDERS.TITLE', icon: 'shopping_cart' },
  ];

  constructor() {}

  ngOnInit(): void {}
}
