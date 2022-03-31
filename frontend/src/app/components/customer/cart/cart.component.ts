import { Component, OnInit, Input } from '@angular/core';
import { CustomerComponent } from 'src/app/components/customer/customer/customer.component';

@Component({
  selector: 'cart-item',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  
  @Input() id = '';
  @Input() name = '';
  @Input() price = -1;
  @Input() cartItems = [];
  // cartItems: Item[] = [];
  // taxPercent: number = 0.06;
  // priceBeforeTax: number = 0;
  // priceAfterTax: number = 0;

  clearCart() {
    this.cartItems = [];
  }

  constructor() { }

  ngOnInit(): void {
  }

}
