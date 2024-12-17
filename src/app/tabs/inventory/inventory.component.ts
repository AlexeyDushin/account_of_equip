import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { InventoryService, InventoryItem } from '../../services/inventory.service';  

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
    private inventoryService: InventoryService  
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
        this.generateReport();
      },
      error: (err) => {
        console.error('Ошибка при загрузке инвентаризации:', err);
      }
    });
  }

  generateReport(): void {
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
          <td>${item.officeEmployee}</td>
          <td>${item.typeName}</td>
          <td>${item.nameEquip}</td>
          <td>${item.idEquip}</td>
        </tr>
      `;
    });

    tableContent += '</tbody></table>';

    const reportContent = `
      <html>
        <head>
          <title>Инвентаризационная опись</title>
          <style>
            table { width: 100%; }
            th, td { padding: 10px; text-align: left; }
            th { background-color: #f2f2f2; }
            tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h1>Инвентаризационная опись кабинета №${this.selectedCabinet} на ${formattedDate}</h1>
          ${tableContent}
        </body>
      </html>
    `;

    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(reportContent);
      newWindow.document.close();
    }
  }
}
