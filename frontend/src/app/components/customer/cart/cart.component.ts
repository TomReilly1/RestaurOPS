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
  @Input() quantity = 1;
  @Input() cartItems = [];

  clearCart() {
    this.cartItems = [];
  }

  constructor() { }

  ngOnInit(): void { }
}
