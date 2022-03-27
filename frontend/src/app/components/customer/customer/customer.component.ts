import { Component, Injectable, OnInit } from '@angular/core';
//import { HttpClient } from '@angular/common/http';
import { Item } from 'src/app/interfaces/item';
import { ItemComponent } from 'src/app/components/customer/item/item.component';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
@Injectable()
export class CustomerComponent implements OnInit {

  items: Item[] = [
    {
      "name": "Cheeseburger",
      "price": 5.99,
      "image": "../../../../assets/cheeseburger.jpg"
    },
    {
      "name": "Hamburger",
      "price": 4.99,
      "image": "../../../../assets/hamburger.jpg"
    },
    {
      "name": "Chicken Sandwich",
      "price": 5.99,
      "image": "../../../../assets/chicken-sandwich.jpg"
    },
  ]

  cartItems: Item[] = [];
  
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  addToCart(item: Item) {
    this.cartItems.push(item);
    // this.http.post<Item>('http://192.168.0.68:5000/', {'name': item.name, 'price': item.price}).subscribe();
    this.http.post<Item>('http://127.0.0.1:5000/', {'name': item.name, 'price': item.price}).subscribe();
  }

}
