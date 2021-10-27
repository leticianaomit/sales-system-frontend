import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsRoutingModule } from './clients-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClientListComponent } from './pages/client-list/client-list.component';
import { ClientFormComponent } from './components/client-form/client-form.component';

@NgModule({
  declarations: [ClientListComponent, ClientFormComponent],
  imports: [CommonModule, ClientsRoutingModule, SharedModule],
})
export class ClientsModule {}
