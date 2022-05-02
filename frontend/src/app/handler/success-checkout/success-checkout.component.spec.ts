import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessCheckoutComponent } from './success-checkout.component';

describe('SuccessCheckoutComponent', () => {
  let component: SuccessCheckoutComponent;
  let fixture: ComponentFixture<SuccessCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessCheckoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
