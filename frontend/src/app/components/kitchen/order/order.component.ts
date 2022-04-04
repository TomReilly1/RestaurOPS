import { Component, OnInit, Input } from '@angular/core';
import { KitchenItem } from "src/app/interfaces/kitchen-item";

@Component({
  selector: 'order-item',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  
  @Input() order_id = '';
  @Input() items_list = [];
  // @Input() price_id = '';
  // @Input() name = '';
  // @Input() price = -1;
  // @Input() quantity = 1;
  // name: string = '';
  // quantity: number = -1;

  logEm() {
    for (let i of this.items_list) {
      console.log(i);
    }
  }


  constructor() { }

  ngOnInit(): void {
  }

}
