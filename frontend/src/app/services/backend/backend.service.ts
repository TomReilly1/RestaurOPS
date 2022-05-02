import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from 'src/app/interfaces/item';
import { KitchenOrder } from 'src/app/interfaces/kitchen-order';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) { }

  private backendURL: string = "http://localhost:4242/api/";

  public createCheckoutSession(items: any, type: string): Observable<any> {
    return this.http.post(this.backendURL + 'create-checkout-session', {
      items: items,
      type: type
    }, {
      responseType: "text"
    });  
  }

  public sendCompletedStatus(order: KitchenOrder): Observable<any> {
    return this.http.post(this.backendURL + 'mark-order-complete', order);
  }
}
