import { Component, HostListener, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  navMode!: MatDrawer['mode'];
  showNav: boolean = true;

  constructor() {}

  ngOnInit(): void {
    this.setNavMode(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setNavMode(window.innerWidth);
  }

  setNavMode(screenWidth: number) {
    if (screenWidth > 1280) {
      this.navMode = 'side';
      this.showNav = true;
    } else {
      this.navMode = 'over';
      this.showNav = false;
    }
  }
}
