import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmEditComponent } from './farm-edit.component';

describe('FarmEditComponent', () => {
  let component: FarmEditComponent;
  let fixture: ComponentFixture<FarmEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FarmEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
