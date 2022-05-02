import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-checkout',
  templateUrl: './success-checkout.component.html',
  styleUrls: ['./success-checkout.component.css']
})
export class SuccessCheckoutComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.navigateByUrl("/")
  }

}
