import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-dialog-delete',
  templateUrl: './dialog-delete.component.html',
  styleUrls: ['./dialog-delete.component.scss'],
})
export class DialogDeleteComponent implements OnInit {
  @Output() whenConfirmDelete = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  onClickButtonDelete() {
    this.whenConfirmDelete.emit();
  }
}
