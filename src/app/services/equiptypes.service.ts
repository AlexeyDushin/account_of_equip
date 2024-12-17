import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface typeEquips {
  id: number;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class EquiptypesService {

  private apiUrl = 'http://localhost:5000/typeequips';
  
  constructor(private http: HttpClient) {}

  getTypeEquips(): Observable<typeEquips[]> {
    return this.http.get<typeEquips[]>(this.apiUrl);
  }

  addTypeEquips(equip: { type: string }): Observable<typeEquips> {
    const employeeData = {
      typeName: equip.type, 
    };
    return this.http.post<typeEquips>(this.apiUrl, employeeData);
  }

  updateTypeEquip(equip: typeEquips): Observable<typeEquips> {
    const equipData = {
      typeName: equip.type,
    };
    return this.http.put<typeEquips>(`${this.apiUrl}/${equip.id}`, equipData);
  }

  deleteTypeEquip(typeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${typeId}`);
  }
}
