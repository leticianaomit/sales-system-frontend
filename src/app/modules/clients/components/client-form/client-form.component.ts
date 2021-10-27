import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResponseClientDTO } from 'src/app/core/models/client';

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
    private dialog: MatDialog
  ) {
    if (this.clientData?.id) {
      this.idClient = this.clientData.id;
      this.clientForm.patchValue(this.clientData);
    }
  }

  ngOnInit(): void {}

  submitForm() {
    const form = this.clientForm.value;

    this.dialog.closeAll();
  }
}
