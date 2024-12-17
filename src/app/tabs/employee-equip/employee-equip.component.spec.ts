import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeEquipComponent } from './employee-equip.component';

describe('EmployeeEquipComponent', () => {
  let component: EmployeeEquipComponent;
  let fixture: ComponentFixture<EmployeeEquipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeEquipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeEquipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
