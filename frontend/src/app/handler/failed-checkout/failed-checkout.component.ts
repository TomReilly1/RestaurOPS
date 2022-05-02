import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-failed-checkout',
  templateUrl: './failed-checkout.component.html',
  styleUrls: ['./failed-checkout.component.css']
})
export class FailedCheckoutComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(x => {
        let type = x.type;
        let order = x.orders;

        if (type == "customer") {
            this.router.navigateByUrl("/customer?orders=" + order);
        } else if (type == "cashier") {
            this.router.navigateByUrl("/cashier?orders=" + order);
        }
    });
  }
}
