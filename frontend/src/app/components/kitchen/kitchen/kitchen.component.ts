import { Component, Injectable, OnInit } from '@angular/core';
import { OrderComponent } from "src/app/components/kitchen/order/order.component";
import { KitchenItem } from 'src/app/interfaces/kitchen-item';
import { KitchenOrder } from 'src/app/interfaces/kitchen-order';
import { WebSocketService } from 'src/app/web-socket.service';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.css']
})
export class KitchenComponent implements OnInit {
  // timeInterval: Subscription;
  title = 'KITCHEN COMPONENT';
  ordersInProgress: KitchenOrder[] = [];
  temp: KitchenOrder[] = [];

  markAsCompleted() {
    // TODO: send to flask
    console.log("WORKING");
  }

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    this.webSocketService.listen('connect').subscribe((data: any) => {
      // console.log(data[0])
      this.temp = data;
      for (let i = 0; i < this.temp.length; i++) {
        // console.log(data[i]);
        this.ordersInProgress.push(data[i]);
      }
      console.log(this.ordersInProgress);

      // for (let i of this.ordersInProgress) {
      //   console.log(i['order_id'])
      //   this.temp.push(i['order_id'])
      // }
    })
  }
}
