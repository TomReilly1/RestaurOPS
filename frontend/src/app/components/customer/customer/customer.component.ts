import { Component, Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Item } from 'src/app/interfaces/item';
import { BackendService } from 'src/app/services/backend/backend.service';


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
@Injectable()
export class CustomerComponent {

  items: Item[] = [
    {
      "id": "cheeseburger",
      "name": "Cheeseburger",
      "price": 5.99,
      "price_id": "price_1KjlsJKyPdTxxYmHKBSf8zik",
      "quantity": 1,
      "image": "../../../../assets/cheeseburger.jpg"
    },
    {
      "id": "hamburger",
      "name": "Hamburger",
      "price": 4.99,
      "price_id": "price_1KjlsJKyPdTxxYmHKBSf8zik",
      "quantity": 1,
      "image": "../../../../assets/hamburger.jpg"
    },
    {
      "id": "chicken-sandwich",
      "name": "Chicken Sandwich",
      "price": 5.99,
      "price_id": "price_1KjqssKyPdTxxYmHuL16F8FE",
      "quantity": 1,
      "image": "../../../../assets/chicken-sandwich.jpg"
    },
    {
      "id": "fries-sm",
      "name": "Fries-Small",
      "price": 2.99,
      "price_id": "price_1KjquAKyPdTxxYmHeWPnlZQ4",
      "quantity": 1,
      "image": "../../../../assets/fries-sm.jpg"
    },
    {
      "id": "fries-md",
      "name": "Fries-Medium",
      "price": 3.99,
      "price_id": "price_1KjquVKyPdTxxYmHXeFOtG44",
      "quantity": 1,
      "image": "../../../../assets/fries-md.jpg"
    },
    {
      "id": "fries-lg",
      "name": "Fries-Large",
      "price": 4.99,
      "price_id": "price_1KjqupKyPdTxxYmH3KH7LssL",
      "quantity": 1,
      "image": "../../../../assets/fries-lg.jpg"
    },
  ];

  cartItems: Item[] = [];
  taxPercent: number = 0.06;
  priceBeforeTax: number = 0;
  taxTotal: number = 0;
  priceAfterTax: number = 0;

  constructor(private backend: BackendService) { }

  addToCart(addedItem: Item) {
    if (this.cartItems.some(i => i.id === addedItem.id)) {
      addedItem.quantity += 1;
    }
    else {
      this.cartItems.push(addedItem);
    }

    
    // this.http.post<Item>('http://192.168.0.68:5000/', {'name': item.name, 'price': item.price}).subscribe();
    // this.http.post<Item>('http://127.0.0.1:5000/', {'name': item.name, 'price': item.price}).subscribe();
  }

  clearCart() {
    for (let i of this.cartItems) {
      i.quantity = 1;
    }

    this.cartItems = [];
  }

  calculateCartPrice() {
    let totalPrice: number = 0;
    for (let i of this.cartItems) {
      totalPrice = totalPrice + (i.price * i.quantity);
      totalPrice = Number(totalPrice.toFixed(2));
    }
    this.priceBeforeTax = totalPrice;
    this.addTax();
  }

  addTax() {
    let temp: number = this.priceBeforeTax * 0.06;
    this.taxTotal = Number(temp.toFixed(4));

    temp = this.priceBeforeTax + this.taxTotal;
    this.priceAfterTax = Number(temp.toFixed(2));
  }

  submitToBackend() {
    this.backend.createCheckoutSession(this.cartItems).subscribe(
      response => {
        window.location.href = response;
        this.clearCart();
      },
      error => console.error("Error: ", error)
    );
  }
}
