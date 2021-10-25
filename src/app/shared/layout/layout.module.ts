import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SharedModule } from '../shared.module';
import { LayoutComponent } from './layout.component';
import { AppRoutingModule } from 'src/app/app-routing.module';

@NgModule({
  declarations: [LayoutComponent, SidenavComponent],
  imports: [CommonModule, SharedModule, AppRoutingModule],
})
export class LayoutModule {}
