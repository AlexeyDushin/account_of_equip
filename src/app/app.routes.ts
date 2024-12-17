import { Routes } from '@angular/router';
import { EmployeeComponent } from './tabs/employee/employee.component';
import { EquipmentComponent } from './tabs/equipment/equipment.component';
import { EquipmentTypesComponent } from './tabs/equipment-types/equipment-types.component';
import { EmployeeEquipComponent } from './tabs/employee-equip/employee-equip.component';
import { InventoryComponent } from './tabs/inventory/inventory.component';
import { TabsComponent } from './tabs/tabs.component';

export const routes: Routes = [
    { 
        path: '', component: TabsComponent, children: [
            { path: '', component: EmployeeComponent},
            { path: 'equipment', component: EquipmentComponent },
            { path: 'equipment-types', component: EquipmentTypesComponent },
            { path: 'employee-equip', component: EmployeeEquipComponent },
            { path: 'inventory', component: InventoryComponent },
        ] 
    }
    
];
