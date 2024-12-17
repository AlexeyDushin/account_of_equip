import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InventoryItem {
  idEmployee: number;
  nameEmployee: string;
  officeEmployee: number;
  typeName: string;
  nameEquip: string;
  idEquip: number;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private apiUrl = 'http://localhost:5000/inventory';

  constructor(private http: HttpClient) {}

  // Метод для получения данных инвентаря по номеру кабинета
  getInventoryByOffice(office: number): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(`${this.apiUrl}/${office}`);
  }
}
