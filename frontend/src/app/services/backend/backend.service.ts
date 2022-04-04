import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from 'src/app/interfaces/item';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) { }

  private backendURL: string = "http://localhost:4242/api/";

  public createCheckoutSession(items: Item[]): Observable<any> {
    return this.http.post(this.backendURL + 'create-checkout-session', items, {
      responseType: "text"
    });  
  }
}
