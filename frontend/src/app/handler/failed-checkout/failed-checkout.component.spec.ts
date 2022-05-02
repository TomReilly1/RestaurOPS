import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedCheckoutComponent } from './failed-checkout.component';

describe('FailedCheckoutComponent', () => {
  let component: FailedCheckoutComponent;
  let fixture: ComponentFixture<FailedCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FailedCheckoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FailedCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
