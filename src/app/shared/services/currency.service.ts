import { CurrencyPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  constructor(private currencyPipe: CurrencyPipe) {}

  transform(value: string) {
    return this.currencyPipe
      .transform(value, '', '', '1.2-2')
      ?.split(',')
      .join('');
  }
}
