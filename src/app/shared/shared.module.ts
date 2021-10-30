import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './modules/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogDeleteComponent } from './components/dialog-delete/dialog-delete.component';

@NgModule({
  declarations: [PageTitleComponent, DialogDeleteComponent],
  imports: [CommonModule, FlexLayoutModule, MaterialModule],
  exports: [
    MaterialModule,
    TranslateModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    PageTitleComponent,
    DialogDeleteComponent,
  ],
})
export class SharedModule {}
