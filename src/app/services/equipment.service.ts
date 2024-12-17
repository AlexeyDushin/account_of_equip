import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Equip {
  id: number;
  name: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  private apiUrl = 'http://localhost:5000/equips';

  constructor(private http: HttpClient) {}

  getEquip(): Observable<Equip[]> {
    return this.http.get<Equip[]>(this.apiUrl);
  }

  addEquip(equip: { name: string, type: number }): Observable<Equip> {
    const equipData = {
      nameEquip: equip.name, 
      typeName: equip.type 
    };
    return this.http.post<Equip>(this.apiUrl, equipData);
  }

  updateEquip(equip: Equip): Observable<Equip> {
    const equipData = {
      nameEquip: equip.name,
      typeName: equip.type
    };
    return this.http.put<Equip>(`${this.apiUrl}/${equip.id}`, equipData);
  }

  deleteEquip(equipId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${equipId}`);
  }

}
