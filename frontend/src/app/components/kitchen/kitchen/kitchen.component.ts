import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';


@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.css']
})
export class KitchenComponent implements OnInit,OnDestroy {
  // timeInterval: Subscription;
  title = 'KITCHEN COMPONENT';
  status: any;





  constructor() { }

  ngOnInit(): void {
    // this.timeInterval = interval(5000)
    // .pipe(
    //   startWith(0),
    //   switchMap(() => this.)
    // )
  }

  ngOnDestroy(): void {
    
  }

}
