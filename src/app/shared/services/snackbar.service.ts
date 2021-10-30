import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(
    private snackbar: MatSnackBar,
    public translate: TranslateService
  ) {}

  async showSuccessSnackbar(message: string, params: any = {}) {
    const messageText = await this.translate.get(message, params).toPromise();
    const actionText = await this.translate.get('GENERAL.OK').toPromise();
    this.snackbar.open(messageText, actionText.toUpperCase(), {
      duration: 3000,
      panelClass: ['green-snackbar'],
      verticalPosition: 'top',
    });
  }

  async showFailureSnackbar(message: string, params: any = {}) {
    const messageText = await this.translate.get(message, params).toPromise();
    const actionText = await this.translate
      .get('GENERAL.TRY_AGAIN')
      .toPromise();
    this.snackbar.open(messageText, actionText, {
      duration: 3000,
      panelClass: ['red-snackbar'],
      verticalPosition: 'top',
    });
  }
}
