import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmDetailsComponent } from './farm-details.component';

describe('FarmDetailsComponent', () => {
  let component: FarmDetailsComponent;
  let fixture: ComponentFixture<FarmDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FarmDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
