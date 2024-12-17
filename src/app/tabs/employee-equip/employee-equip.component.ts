import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormsModule } from '@angular/forms';
import { NgFor, NgIf } from "@angular/common";
import { ReactiveFormsModule } from '@angular/forms';
import { empEquips, EmpequipsService } from '../../services/empequips.service';

@Component({
  selector: 'app-employee-equip',
  imports: [NgFor, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './employee-equip.component.html',
  styleUrl: './employee-equip.component.scss'
})
export class EmployeeEquipComponent implements OnInit {

  constructor(private empequipsService: EmpequipsService) {
    this.updatePagination();
  }

  empEquips: empEquips[] = [];
  
  ngOnInit(): void {
    this.empequipsService.getEmpEquips().subscribe({
      next: (data: any) => {
        this.empEquips = data.map((item: { idEmpEquip: any; nameEmployee: any; officeEmployee: any; typeName: any; nameEquip: any; }) => ({
          id: item.idEmpEquip,          
          name: item.nameEmployee,    
          office: item.officeEmployee,
          type: item.typeName,
          equip: item.nameEquip,  
        }));
        this.filteredEmpEquips = [...this.empEquips];
        this.updatePagination(); 
      },
      error: (err) => {
        console.error('Ошибка при загрузке данных:', err);
      },
    });
  }

// добавление записи в таблицу

empEquipsToAdd: any = null;
newEmpEquips: any = {id: 0, name: '', office: null, type: '', equip: '' };

onAddEmpEquips() {
  this.empEquipsToAdd = true; 
  this.newEmpEquips = {id: 0, name: '', office: null, type: '', equip: '' }; 
}

onAddSubmit(): void {
  const newEmpEquips = {
    name: this.formAdd.value.name,
    office: this.formAdd.value.office,
    type: this.formAdd.value.type,
    equip: this.formAdd.value.equip
  };

  this.empequipsService.addEmpEquips(newEmpEquips).subscribe({
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
  this.empEquipsToAdd = null;
}

formAdd = new FormGroup ({
  name: new FormControl(),
  office: new FormControl(),
  type: new FormControl(),
  equip: new FormControl()
})

// редактирование записи в таблице

empEquipsToEdit: any = null;  
editedEmpEquips = { id: 0, name: '', office: null, type: '', equip: '' }; 

onEditEmpEquips(empEquip: any) {
  this.empEquipsToEdit = empEquip;
  this.editedEmpEquips = { ...empEquip };
}

//я не понимаю, зачем здесь редактировать что-то, если все столбцы этой таблицы это внешние ключи, но решил оставить эту функцию, так как в ТЗ написано, чтобы у всех вкладок была

onEditSubmit(): void {
  if (this.empEquipsToEdit) {
    const updatedEmpEquip = {
      id: this.empEquipsToEdit.id,
      name: this.formEdit.value.name,
      office: this.formEdit.value.office,
      type: this.formEdit.value.type,
      equip: this.formEdit.value.equip
    };

    this.empequipsService.updateEmpEquip(updatedEmpEquip).subscribe({
      next: (response) => {
        console.log('Данные сотрудника успешно обновлены:', response);

        const index = this.empEquips.findIndex(empEquip => empEquip.id === response.id);
        if (index !== -1) {
          this.empEquips[index] = response;
        }
        this.ngOnInit();
        this.formEdit.reset();
        this.empEquipsToEdit = null;
      },
      error: (err) => {
        console.error('Ошибка при обновлении данных сотрудника:', err);
      }
    });
  }
}

onEditCancel() {
  this.empEquipsToEdit = null;
}

formEdit = new FormGroup ({
  name: new FormControl(),
  office: new FormControl(),
  type: new FormControl(),
  equip: new FormControl()
})

// удаление записи из таблицы

empEquipsToDelete: any = null;

onDeleteEmpEquips(empEquip: any) {
  this.empEquipsToDelete = empEquip;
}

onDeleteSubmit(): void {
  if (this.empEquipsToDelete) {
    this.empequipsService.deleteEmpEquip(this.empEquipsToDelete.id).subscribe({
      next: () => {
        console.log('Техника сотрудника удалено успешно');
        this.ngOnInit();
        this.empEquips = this.empEquips.filter(empEquip => empEquip.id !== this.empEquipsToDelete?.id);
        this.empEquipsToDelete = null;
      },
      error: (err) => {
        console.error('Ошибка при удалении техники сотрудника:', err);
      }
    });
  }
}

onDeleteCancel() {
  this.empEquipsToDelete = null;
}

// пагинация страницы

currentPage = 1; 
itemsPerPage = 10; 
totalPages = 1; 
filteredEmpEquips = [...this.empEquips]; 
displayedEmpEquips: any[] = []; 

updatePagination() {
  this.totalPages = Math.ceil(this.filteredEmpEquips.length / this.itemsPerPage);
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  this.displayedEmpEquips = this.filteredEmpEquips.slice(start, end);
}

getCurrentPageItems() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  return this.filteredEmpEquips.slice(start, end);
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
    this.searchEmpEquips();
  }
}

searchEmpEquips() {
  const query = this.searchQuery.trim().toLowerCase();
  if (query) {
    this.filteredEmpEquips = this.empEquips.filter(empEquip =>
      empEquip.name.toLowerCase().includes(query)
    );
  } else {
    this.filteredEmpEquips = [...this.empEquips]; 
  }
  this.currentPage = 1; 
  this.updatePagination(); 
}


}
