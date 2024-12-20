import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-inventory-modal',
  template: `
    <h1 mat-dialog-title>Инвентаризационная опись</h1>
    <div mat-dialog-content [innerHTML]="reportContent"></div>
    <div mat-dialog-actions>
      <button mat-button (click)="close()">Закрыть</button>
    </div>
  `,
  styleUrls: ['./inventory-modal.component.scss']
})
export class InventoryModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public reportContent: string,
    private dialogRef: MatDialogRef<InventoryModalComponent>
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
