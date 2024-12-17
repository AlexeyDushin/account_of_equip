import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormsModule } from '@angular/forms';
import { NgFor, NgIf } from "@angular/common";
import { ReactiveFormsModule } from '@angular/forms';
import { EquiptypesService, typeEquips } from '../../services/equiptypes.service';

@Component({
  selector: 'app-equipment-types',
  imports: [NgFor, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './equipment-types.component.html',
  styleUrl: './equipment-types.component.scss'
})
export class EquipmentTypesComponent implements OnInit {

  constructor(private equiptypesService: EquiptypesService) {
    this.updatePagination();
  }

  types: typeEquips[] = [];
  
  ngOnInit(): void {
    this.equiptypesService.getTypeEquips().subscribe({
      next: (data: any) => {
        this.types = data.map((item: { idTypeEquip: any; typeName: any; }) => ({
          id: item.idTypeEquip,          
          type: item.typeName
        }));
        this.filteredTypes = [...this.types];
        this.updatePagination(); 
      },
      error: (err) => {
        console.error('Ошибка при загрузке данных:', err);
      },
    });
  }

  // добавление записи в таблицу

  typeToAdd: any = null;
  newType: any = { name: '', type: null };

  onAddType() {
    this.typeToAdd = true; 
    this.newType = { name: '', type: null }; 
  }

  onAddSubmit(): void {
    const newEquips = {
      type: this.formAdd.value.type,
    };

    this.equiptypesService.addTypeEquips(newEquips).subscribe({
      next: (response) => {
        console.log('Тип техники успешно добавлен:', response);
        this.ngOnInit();
        this.formAdd.reset();
      },
      error: (err) => {
        console.error('Ошибка при добавлении типа техники:', err);
      }
    });
  }

  onAddCancel() {
    this.typeToAdd = null;
  }

  formAdd = new FormGroup ({
    type: new FormControl()
  })

// редактирование записи в таблице

  typeToEdit: any = null;  
  editedType = { id: 0, type: '' }; 

  onEditType(type: any) {
    this.typeToEdit = type;
    this.editedType = { ...type };
  }

  onEditSubmit(): void {
    if (this.typeToEdit) {
      const updatedType = {
        id: this.typeToEdit.id,
        type: this.formEdit.value.type
      };

      this.equiptypesService.updateTypeEquip(updatedType).subscribe({
        next: (response) => {
          console.log('Тип техники успешно обновлен:', response);

          const index = this.types.findIndex(type => type.id === response.id);
          if (index !== -1) {
            this.types[index] = response;
          }
          this.ngOnInit();
          this.formEdit.reset();
          this.typeToEdit = null;
        },
        error: (err) => {
          console.error('Ошибка при обновлении типа техники:', err);
        }
      });
    }
  }

  onEditCancel() {
    this.typeToEdit = null;
  }

  formEdit = new FormGroup ({
    type: new FormControl()
  })

// удаление записи из таблицы

  typeToDelete: any = null;

  onDeleteType(type: any) {
    this.typeToDelete = type;
  }

  onDeleteSubmit(): void {
    if (this.typeToDelete) {
      this.equiptypesService.deleteTypeEquip(this.typeToDelete.id).subscribe({
        next: () => {
          console.log('Тип техники удалён успешно');
          this.ngOnInit();
          this.typeToDelete = null;
        },
        error: (err) => {
          console.error('Ошибка при удалении типа техники:', err);
        }
      });
    }
  }

  onDeleteCancel() {
    this.typeToDelete = null;
  }

// пагинация страницы

  currentPage = 1; 
  itemsPerPage = 10; 
  totalPages = 1; 
  filteredTypes = [...this.types]; 
  displayedTypes: any[] = []; 

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredTypes.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedTypes = this.filteredTypes.slice(start, end);
  }

  getCurrentPageItems() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredTypes.slice(start, end);
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
      this.searchTypes(); 
    }
  }

  searchTypes() {
    const query = this.searchQuery.trim().toLowerCase();
    if (query) {
      this.filteredTypes = this.types.filter(type =>
        type.type.toLowerCase().includes(query)
      );
    } else {
      this.filteredTypes = [...this.types]; 
    }
    this.currentPage = 1; 
    this.updatePagination(); 
  }
  

}
