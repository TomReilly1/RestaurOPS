import { Component, OnInit } from '@angular/core';
import { Item } from 'src/app/interfaces/item';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  items: Item[] = [
    {
      "name": "Hamburger",
      "price": 6.99,
      "image": "image"
    },
    {
      "name": "Hamburger",
      "price": 6.99,
      "image": "image"
    },
    {
      "name": "Hamburger",
      "price": 6.99,
      "image": "image"
    },
    {
      "name": "Hamburger",
      "price": 6.99,
      "image": "image"
    },
    {
      "name": "Hamburger",
      "price": 6.99,
      "image": "image"
    },
    {
      "name": "Hamburger",
      "price": 6.99,
      "image": "image"
    },
    {
      "name": "Hamburger",
      "price": 6.99,
      "image": "image"
    },
    {
      "name": "Hamburger",
      "price": 6.99,
      "image": "image"
    },
    {
      "name": "Hamburger",
      "price": 6.99,
      "image": "image"
    },
    {
      "name": "Hamburger",
      "price": 6.99,
      "image": "image"
    },
    {
      "name": "Hamburger",
      "price": 6.99,
      "image": "image"
    },
    {
      "name": "Hamburger",
      "price": 6.99,
      "image": "image"
    },
    {
      "name": "Hamburger",
      "price": 6.99,
      "image": "image"
    },
    {
      "name": "Hamburger",
      "price": 6.99,
      "image": "image"
    },
    {
      "name": "Hamburger",
      "price": 6.99,
      "image": "image"
    }
  ]

  cartItems: Item[] = [];
  
  constructor() { }

  ngOnInit(): void {
  }

  addToCart(item: Item) {
    this.cartItems.push(item);
  }

}
