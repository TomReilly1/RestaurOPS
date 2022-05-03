import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from 'src/app/interfaces/item';
import { BackendService } from 'src/app/services/backend/backend.service';

@Component({
  selector: 'app-cashier',
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.css']
})
export class CashierComponent {
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

  constructor(private backend: BackendService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(x => {
      let orders = x.orders;

      //convert from base64url and then from json
      let ordersJson = atob(orders);
      let ordersJsonParsed = JSON.parse(ordersJson);
      this.cartItems = ordersJsonParsed;
      this.calculateCartPrice();
    })
  }

  addToCart(addedItem: Item) {
    if (this.cartItems.some(i => i.id === addedItem.id)) {
      addedItem.quantity += 1;
    }
    else {
      this.cartItems.push(addedItem);
    }
  }

  clearCart() {
    for (let i of this.cartItems) {
      i.quantity = 1;
    }

    this.cartItems = [];
    this.router.navigate([], {
      queryParams: {
        'orders': null,
      },
      queryParamsHandling: 'merge'
    })
    this.calculateCartPrice();
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
    this.backend.createCheckoutSession(this.cartItems, "cashier").subscribe(
      response => {
        window.location.href = response;
        this.clearCart();
      },
      error => console.error("Error: ", error)
    );
  }

  removeItem(itemID: string) {
    this.cartItems = this.cartItems.filter(i => i.id !== itemID);
    this.calculateCartPrice();
  }
}