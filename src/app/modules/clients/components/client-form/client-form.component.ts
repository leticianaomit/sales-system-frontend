import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResponseClientDTO } from 'src/app/core/models/client';
import { ClientsService } from 'src/app/core/services/clients.service';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.scss'],
})
export class ClientFormComponent implements OnInit {
  idClient!: string;
  clientForm: FormGroup = this.fb.group({
    name: [null, Validators.required],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) private clientData: ResponseClientDTO,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private clientsService: ClientsService
  ) {
    if (this.clientData?.id) {
      this.idClient = this.clientData.id;
      this.clientForm.patchValue(this.clientData);
    }
  }

  ngOnInit(): void {}

  submitForm() {
    const form = this.clientForm.value;
    const client: ResponseClientDTO = form;

    if (this.idClient) this.updateClient(client);
    else this.saveClient(client);

    this.dialog.closeAll();
  }

  refreshClientList() {
    this.clientsService.getClientList();
  }

  private async updateClient(client: ResponseClientDTO) {
    await this.clientsService.updateClient(this.idClient, client);
    this.refreshClientList();
  }

  private async saveClient(client: ResponseClientDTO) {
    await this.clientsService.saveClient(client);
    this.refreshClientList();
  }
}
