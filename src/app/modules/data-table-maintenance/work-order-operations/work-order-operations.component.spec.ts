import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkOrderOperationsComponent } from './work-order-operations.component';

describe('WorkOrderOperationsComponent', () => {
  let component: WorkOrderOperationsComponent;
  let fixture: ComponentFixture<WorkOrderOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkOrderOperationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkOrderOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
