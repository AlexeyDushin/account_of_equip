import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormsModule, Validators } from '@angular/forms';
import { NgFor, NgIf } from "@angular/common";
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeeService, Employee } from '../../services/employee.service';

@Component({
  selector: 'app-employee',
  imports: [NgFor, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.scss',
})
export class EmployeeComponent implements OnInit {

  constructor(private employeeService: EmployeeService) {
    this.updatePagination();
  }

  employees: Employee[] = [];

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data: any) => {
        this.employees = data.map((item: { idEmployee: any; nameEmployee: any; officeEmployee: any; }) => ({
          id: item.idEmployee,          
          name: item.nameEmployee,    
          office: item.officeEmployee  
        }));
        this.filteredemployees = [...this.employees];
        this.updatePagination(); 
      },
      error: (err) => {
        console.error('Ошибка при загрузке данных:', err);
      },
    });
  }

  // добавление записи в таблицу

  employeeToAdd: any = null;
  newEmployee: any = { name: '', office: null };

  onAddEmployee() {
    this.employeeToAdd = true; 
    this.newEmployee = { name: '', office: null }; 
  }

  onAddSubmit(): void {
    const newEmployee = {
      name: this.formAdd.value.name,
      office: this.formAdd.value.office
    };

    this.employeeService.addEmployee(newEmployee).subscribe({
      next: (response) => {
        console.log('Сотрудник успешно добавлен:', response);
        this.ngOnInit();
        this.formAdd.reset();
      },
      error: (err) => {
        console.error('Ошибка при добавлении сотрудника:', err);
      }
    });
  }

  onAddCancel() {
    this.employeeToAdd = null;
  }

  formAdd = new FormGroup ({
    name: new FormControl(),
    office: new FormControl()
  })

// редактирование записи в таблице

  employeeToEdit: any = null;  
  editedEmployee = { id: 0, name: '', office: 0 }; 

  onEditEmployee(employee: any) {
    this.employeeToEdit = employee;
    this.editedEmployee = { ...employee };
  }

  onEditSubmit(): void {
    if (this.employeeToEdit) {
      const updatedEmployee = {
        id: this.employeeToEdit.id,
        name: this.formEdit.value.name,
        office: this.formEdit.value.office
      };

      this.employeeService.updateEmployee(updatedEmployee).subscribe({
        next: (response) => {
          console.log('Сотрудник успешно обновлен:', response);

          const index = this.employees.findIndex(emp => emp.id === response.id);
          if (index !== -1) {
            this.employees[index] = response;
            this.filteredemployees = [...this.employees];
            this.updatePagination();
          }
          this.ngOnInit();
          this.formEdit.reset();
          this.employeeToEdit = null;
        },
        error: (err) => {
          console.error('Ошибка при обновлении сотрудника:', err);
        }
      });
    }
  }

  onEditCancel() {
    this.employeeToEdit = null;
  }

  formEdit = new FormGroup ({
    name: new FormControl(),
    office: new FormControl()
  })

// удаление записи из таблицы

  employeeToDelete: any = null;

  onDeleteEmployee(employee: any) {
    this.employeeToDelete = employee;
  }

  onDeleteSubmit(): void {
    if (this.employeeToDelete) {
      this.employeeService.deleteEmployee(this.employeeToDelete.id).subscribe({
        next: () => {
          console.log('Сотрудник удален успешно');
          this.ngOnInit();
          this.employeeToDelete = null;
        },
        error: (err) => {
          console.error('Ошибка при удалении сотрудника:', err);
        }
      });
    }
  }

  onDeleteCancel() {
    this.employeeToDelete = null;
  }

// пагинация страницы

  currentPage = 1; 
  itemsPerPage = 10; 
  totalPages = 1; 
  filteredemployees: Employee[] = [...this.employees];
  displayedemployees: any[] = []; 

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredemployees.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedemployees = this.filteredemployees.slice(start, end);
  }

  getCurrentPageItems() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredemployees.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

// поиск записей в таблице по наименованию

  searchQuery: string = '';
  
  onSearchChange() {
    if (!this.searchQuery.trim()) {
      this.searchEmployee(); 
    }
  }

  searchEmployee() {
    const query = this.searchQuery.trim().toLowerCase();
    if (query) {
      this.filteredemployees = this.employees.filter(employee =>
        employee.name.toLowerCase().includes(query)
      );
    } else {
      this.filteredemployees = [...this.employees]; 
    }
    this.currentPage = 1; 
    this.updatePagination(); 
  }
  

}
