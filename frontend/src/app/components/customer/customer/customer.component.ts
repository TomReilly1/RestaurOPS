import { Component, Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Item } from 'src/app/interfaces/item';
// import { ItemComponent } from 'src/app/components/customer/item/item.component';


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
@Injectable()
export class CustomerComponent implements OnInit {

  items: Item[] = [
    {
      "id": "cheeseburger",
      "name": "Cheeseburger",
      "price": 5.99,
      "image": "../../../../assets/cheeseburger.jpg"
    },
    {
      "id": "hamburger",
      "name": "Hamburger",
      "price": 4.99,
      "image": "../../../../assets/hamburger.jpg"
    },
    {
      "id": "chicken-sandwich",
      "name": "Chicken Sandwich",
      "price": 5.99,
      "image": "../../../../assets/chicken-sandwich.jpg"
    },
    {
      "id": "fries-sm",
      "name": "Fries-Small",
      "price": 2.99,
      "image": "../../../../assets/fries-sm.jpg"
    },
    {
      "id": "fries-md",
      "name": "Fries-Medium",
      "price": 3.99,
      "image": "../../../../assets/fries-md.jpg"
    },
    {
      "id": "fries-lg",
      "name": "Fries-Large",
      "price": 4.99,
      "image": "../../../../assets/fries-lg.jpg"
    },
  ]

  cartItems: Item[] = [];
  taxPercent: number = 0.06;
  priceBeforeTax: number = 0;
  taxTotal: number = 0;
  priceAfterTax: number = 0;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  addToCart(item: Item) {
    this.cartItems.push(item);
    // this.http.post<Item>('http://192.168.0.68:5000/', {'name': item.name, 'price': item.price}).subscribe();
    // this.http.post<Item>('http://127.0.0.1:5000/', {'name': item.name, 'price': item.price}).subscribe();
  }

  clearCart() {
    this.cartItems = [];
  }

  calculateCartPrice() {
    let totalPrice: number = 0;
    for (let i of this.cartItems) {
      totalPrice = totalPrice + i.price;
      totalPrice = Number(totalPrice.toFixed(2));
    }
    this.priceBeforeTax = totalPrice;
    this.addTax()
  }

  addTax() {
    this.taxTotal = this.priceBeforeTax * 0.06;
    let temp: number = this.priceBeforeTax + this.taxTotal;
    this.priceAfterTax = Number(temp.toFixed(2));
  }

  submitToBackend() {
    // for (let i of this.cartItems) {
    //   this.http.post<Item>('http://127.0.0.1:5000/', {'id': i.id, 'name': i.name, 'price': i.price}).subscribe();
    // }
    this.http.post('http://127.0.0.1:5000/', this.cartItems).subscribe(
      response => console.log("Success! ", response),
      error => console.error("Error: ", error)
    );

    this.clearCart();
  }

}
