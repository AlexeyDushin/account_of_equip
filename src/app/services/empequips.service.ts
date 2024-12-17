import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface empEquips {
  id: number;
  name: string;
  office: number;
  type: string;
  equip: string
}

@Injectable({
  providedIn: 'root'
})
export class EmpequipsService {

  private apiUrl = 'http://localhost:5000/empequips';
  
  constructor(private http: HttpClient) {}

  getEmpEquips(): Observable<empEquips[]> {
    return this.http.get<empEquips[]>(this.apiUrl);
  }

  addEmpEquips(empequips: { name: string, office: number, type: string, equip: string }): Observable<empEquips> {
    const employeeData = {
      nameEmployee: empequips.name, 
      officeEmployee: empequips.office,
      typeName: empequips.type,
      nameEquip: empequips.equip
    };
    return this.http.post<empEquips>(this.apiUrl, employeeData);
  }

  updateEmpEquip(empequip: empEquips): Observable<empEquips> {
    const equipData = {
      nameEmployee: empequip.name,
      officeEmployee: empequip.office,
      typeName: empequip.type,
      nameEquip: empequip.equip
    };
    return this.http.put<empEquips>(`${this.apiUrl}/${empequip.id}`, equipData);
  }

  deleteEmpEquip(empEquipId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${empEquipId}`);
  }
}
