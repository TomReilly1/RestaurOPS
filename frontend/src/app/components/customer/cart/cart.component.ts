import { Component, OnInit, Input } from '@angular/core';


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

  constructor() { }

  ngOnInit(): void {
  }

}
