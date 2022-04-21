import { Component, Injectable, OnInit } from '@angular/core';
// import { OrderComponent } from "src/app/components/kitchen/order/order.component";
// import { KitchenItem } from 'src/app/interfaces/kitchen-item';
import { KitchenOrder } from 'src/app/interfaces/kitchen-order';
import { WebSocketService } from 'src/app/web-socket.service';
import { BackendService } from "src/app/services/backend/backend.service";

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.css']
})
export class KitchenComponent implements OnInit {

  title = 'KITCHEN COMPONENT';
  ordersInProgress: KitchenOrder[] = [];
  temp: KitchenOrder[] = [];


  markAsCompleted(order: KitchenOrder) {
    this.backend.sendCompletedStatus(order).subscribe(
      response => {
        console.log("Response: ", response)
        location.reload()
      },
      error => console.error("Error: ", error)
    );
  }


  constructor(
    private webSocketService: WebSocketService,
    private backend: BackendService
  ) { }


  ngOnInit(): void {
    // WebSocket for intial connection
    this.webSocketService.listen('connect').subscribe((data: any) => {
      this.temp = data;

      if (this.temp === undefined) {
        console.log("Undefined")
      }
      else {
        for (let i = 0; i < this.temp.length; i++) {
          this.ordersInProgress.push(data[i]);
        }
      }

      console.log(this.ordersInProgress);
    })

    // WebSocket for new orders
    this.webSocketService.listen('newOrder').subscribe((data: any) => {
      this.ordersInProgress.push(data);
      
      console.log(this.ordersInProgress);
    });
  }
}
