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
  ordersInProgress: KitchenOrder[] = [

  ];

  selectedIndexPOS = 0;

  markAsCompleted(order: KitchenOrder) {
    this.backend.sendCompletedStatus(order).subscribe(
      response => {
        console.log("Response: ", response)
        location.reload()
      },
      error => console.error("Error: ", error)
    );

    //remove order from ordersInProgress array
    let index = this.ordersInProgress.indexOf(order);
    this.ordersInProgress.splice(index, 1);
  }

  public now: Date = new Date();


  constructor(
    private webSocketService: WebSocketService,
    private backend: BackendService,
  )
  {
    setInterval(() => {
      this.now = new Date();
    }, 1000);
  }


  ngOnInit(): void {
    // WebSocket for intial connection
    this.ordersInProgress = [];

    this.webSocketService.listen('connect').subscribe((data: any) => {
      for (let i = 0; i < data.length; i++) {
        this.ordersInProgress.push(data[i]);
      }
    });


    // WebSocket for new orders
    this.webSocketService.listen('newOrder').subscribe((data: any) => {
        this.ordersInProgress.push(data);
    });
  }

  truncateOrderID(orderID: string) {
    return orderID.substring(0, 5);
  }

  onKey(event: any) {
    console.log(event.keyCode);
    //arrow keys to change selected item, support only left and right
    if (event.keyCode === 37 && this.selectedIndexPOS > 0) {
        this.selectedIndexPOS--;
        console.log(this.selectedIndexPOS);
    } else if (event.keyCode === 39 && this.selectedIndexPOS < this.ordersInProgress.length - 1) {
        this.selectedIndexPOS++;
    }

    //if enter or spacebar, call markAsCompleted
    if (event.keyCode === 13 || event.keyCode === 32) {
        this.markAsCompleted(this.ordersInProgress[this.selectedIndexPOS]);
    }
  }

  isSelected(index: number) {
    return this.selectedIndexPOS === index;
  }
}
