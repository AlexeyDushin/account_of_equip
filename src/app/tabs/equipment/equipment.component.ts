import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormsModule } from '@angular/forms';
import { NgFor, NgIf } from "@angular/common";
import { ReactiveFormsModule } from '@angular/forms';
import { EquipmentService, Equip } from '../../services/equipment.service';

@Component({
  selector: 'app-equipment',
  imports: [NgFor, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './equipment.component.html',
  styleUrl: './equipment.component.scss'
})
export class EquipmentComponent implements OnInit {

  constructor(private equipmentService: EquipmentService) {
      this.updatePagination();
    }

  equips: Equip[] = [];
  
  ngOnInit(): void {
    this.equipmentService.getEquip().subscribe({
      next: (data: any) => {
        this.equips = data.map((item: { idEquip: any; nameEquip: any; typeName: any; }) => ({
          id: item.idEquip,          
          name: item.nameEquip,    
          type: item.typeName  
        }));
        this.filteredEquips = [...this.equips];
        this.updatePagination(); 
      },
      error: (err) => {
        console.error('Ошибка при загрузке данных:', err);
      },
    });
  }

// добавление записи в таблицу

  equipToAdd: any = null;
  newEquip: any = { name: '', type: null };

  onAddEquip() {
    this.equipToAdd = true; 
    this.newEquip = { name: '', type: null }; 
  }

  onAddSubmit(): void {
    const newEquip = {
      name: this.formAdd.value.name,
      type: this.formAdd.value.type
    };

    this.equipmentService.addEquip(newEquip).subscribe({
      next: (response) => {
        console.log('Техника успешно добавлена:', response);
        this.ngOnInit();
        this.formAdd.reset();
      },
      error: (err) => {
        console.error('Ошибка при добавлении техники:', err);
      }
    });
  }

  onAddCancel() {
    this.equipToAdd = null;
  }

  formAdd = new FormGroup ({
    name: new FormControl(),
    type: new FormControl()
  })

// редактирование записи в таблице

  equipToEdit: any = null;  
  editedEquip = { id: 0, name: '', type: 0 }; 

  onEditEquip(equip: any) {
    this.equipToEdit = equip;
    this.editedEquip = { ...equip };
  }

  onEditSubmit(): void {
    if (this.equipToEdit) {
      const updatedEquip = {
        id: this.equipToEdit.id,
        name: this.formEdit.value.name,
        type: this.formEdit.value.type
      };

      this.equipmentService.updateEquip(updatedEquip).subscribe({
        next: (response) => {
          console.log('Оборудование успешно обновлено:', response);

          const index = this.equips.findIndex(equip => equip.id === response.id);
          if (index !== -1) {
            this.equips[index] = response;
            this.filteredEquips = [...this.equips];
            this.updatePagination();
          }
          this.ngOnInit();
          this.formEdit.reset();
          this.equipToEdit = null;
        },
        error: (err) => {
          console.error('Ошибка при обновлении оборудования:', err);
        }
      });
    }
  }

  onEditCancel() {
    this.equipToEdit = null;
  }

  formEdit = new FormGroup ({
    name: new FormControl(),
    type: new FormControl()
  })

// удаление записи из таблицы

  equipToDelete: any = null;

  onDeleteEquip(equip: any) {
    this.equipToDelete = equip;
  }

  onDeleteSubmit(): void {
    if (this.equipToDelete) {
      this.equipmentService.deleteEquip(this.equipToDelete.id).subscribe({
        next: () => {
          console.log('Техника удалена успешно');
          this.ngOnInit();
          this.equipToDelete = null;
        },
        error: (err) => {
          console.error('Ошибка при удалении техники:', err);
        }
      });
    }
  }

  onDeleteCancel() {
    this.equipToDelete = null;
  }

// пагинация страницы

  currentPage = 1; 
  itemsPerPage = 10; 
  totalPages = 1; 
  filteredEquips = [...this.equips]; 
  displayedEquips: any[] = []; 

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredEquips.length / this.itemsPerPage);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedEquips = this.filteredEquips.slice(start, end);
  }

  getCurrentPageItems() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredEquips.slice(start, end);
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
      this.searchEquip(); 
    }
  }

  searchEquip() {
    const query = this.searchQuery.trim().toLowerCase();
    if (query) {
      this.filteredEquips = this.equips.filter(equip =>
        equip.name.toLowerCase().includes(query)
      );
    } else {
      this.filteredEquips = [...this.equips]; 
    }
    this.currentPage = 1; 
    this.updatePagination(); 
  }
  

}
