import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-failed-checkout',
  templateUrl: './failed-checkout.component.html',
  styleUrls: ['./failed-checkout.component.css']
})
export class FailedCheckoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    let bc = new BroadcastChannel("checkout");
    bc.postMessage("failed");
    close();
  }

}
