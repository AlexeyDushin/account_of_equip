import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { InventoryService, InventoryItem } from '../../services/inventory.service';
import { InventoryModalComponent } from './inventory-modal/inventory-modal.component';

@Component({
  selector: 'app-inventory',
  imports: [FormsModule, NgFor],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  cabinets: number[] = []; 
  selectedCabinet: number | null = null; 
  inventory: InventoryItem[] = []; 

  constructor(
    private employeeService: EmployeeService,
    private inventoryService: InventoryService,  
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.employeeService.getUniqueOffices().subscribe({
      next: (offices) => {
        this.cabinets = offices;
        if (this.cabinets.length > 0) {
          this.selectedCabinet = this.cabinets[0]; 
        }
      },
      error: (err) => {
        console.error('Ошибка при загрузке кабинетов:', err);
      },
    });
  }

  createReport(): void {
    if (!this.selectedCabinet) {
      alert('Пожалуйста, выберите кабинет');
      return;
    }

    this.inventoryService.getInventoryByOffice(this.selectedCabinet).subscribe({
      next: (data) => {
        this.inventory = data;
        this.openReportModal(this.generateReport());
      },
      error: (err) => {
        console.error('Ошибка при загрузке инвентаризации:', err);
      }
    });
  }

  generateReport(): string {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('ru-RU');

    let tableContent = '<table border="1" style="border-collapse: collapse;">';
    tableContent += `
      <thead>
        <tr>
          <th>№ п/п</th>
          <th>Сотрудник</th>
          <th>Таб №</th>
          <th>Тип техники</th>
          <th>Техника</th>
          <th>Инв №</th>
        </tr>
      </thead>
      <tbody>
    `;

    this.inventory.forEach((item, index) => {
      tableContent += `
        <tr>
          <td>${index + 1}</td>
          <td>${item.nameEmployee}</td>
          <td>${item.idEmployee}</td>
          <td>${item.typeName}</td>
          <td>${item.nameEquip}</td>
          <td>${item.idEquip}</td>
        </tr>
      `;
    });

    tableContent += '</tbody></table>';

    return `
      <p>Инвентаризационная опись кабинета №${this.selectedCabinet} на ${formattedDate}</p>
      ${tableContent}
    `;
  }
  openReportModal(reportContent: string): void {
    this.dialog.open(InventoryModalComponent, {
      data: reportContent,
      panelClass: 'custom-dialog-container' 
    });
  }
}
