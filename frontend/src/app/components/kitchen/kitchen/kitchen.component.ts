import { Component, Injectable, OnInit } from '@angular/core';
import { WebSocketService } from 'src/app/web-socket.service';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.css']
})
export class KitchenComponent implements OnInit {
  // timeInterval: Subscription;
  title = 'KITCHEN COMPONENT';

  constructor(private webSocketService: WebSocketService) { }

  ngOnInit(): void {
    this.webSocketService.listen('connect').subscribe((data) => {
      console.log(data)
    })
  }
}
