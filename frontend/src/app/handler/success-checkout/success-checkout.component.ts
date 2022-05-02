import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-success-checkout',
  templateUrl: './success-checkout.component.html',
  styleUrls: ['./success-checkout.component.css']
})
export class SuccessCheckoutComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(x => {
        let type = x.type;

        if (type == "customer") {
            this.router.navigateByUrl("/customer");
        } else if (type == "cashier") {
            this.router.navigateByUrl("/cashier");
        }
    });
  }

}
