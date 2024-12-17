import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface Employee {
  id: number;
  name: string;
  office: number;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = 'http://localhost:5000/employees';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  addEmployee(employee: { name: string, office: number }): Observable<Employee> {
    const employeeData = {
      nameEmployee: employee.name, 
      officeEmployee: employee.office
    };
    return this.http.post<Employee>(this.apiUrl, employeeData);
  }
  
  updateEmployee(employee: Employee): Observable<Employee> {
    const employeeData = {
      nameEmployee: employee.name,
      officeEmployee: employee.office
    };
    return this.http.put<Employee>(`${this.apiUrl}/${employee.id}`, employeeData);
  }

  deleteEmployee(employeeId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${employeeId}`);
  }

  getUniqueOffices(): Observable<number[]> {
    return this.getEmployees().pipe(
      map((employees: Employee[]) => {
        const offices = employees.map((employee) => (employee as any).officeEmployee);
        return [...new Set(offices)];
      })
    );
  }
  
}
