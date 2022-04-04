import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CashierComponent } from './components/cashier/cashier/cashier.component';
import { CustomerComponent } from './components/customer/customer/customer.component';
import { KitchenComponent } from './components/kitchen/kitchen/kitchen.component';
import { ItemComponent } from './components/customer/item/item.component';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CartComponent } from './components/customer/cart/cart.component';
import { MatRippleModule } from '@angular/material/core';

// ... other imports
import { FormsModule } from '@angular/forms';
import { SocketIoModule } from 'ngx-socket-io';

import { OrderComponent } from './components/kitchen/order/order.component';
//const config: SocketIoConfig = { url: 'ws://localhost:4242', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    CashierComponent,
    CartComponent,
    CustomerComponent,
    KitchenComponent,
    ItemComponent,
    OrderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    FormsModule,
    SocketIoModule,
    //SocketIoModule.forRoot(config),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
