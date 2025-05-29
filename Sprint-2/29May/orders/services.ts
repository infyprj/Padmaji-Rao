import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http"
import { throwError, Observable, catchError, BehaviorSubject } from "rxjs"
import { tap } from 'rxjs/operators';
import { IPlaceOrderRequest } from '../../interfaces/placeOrderRequest';
import { IOrderItem } from '../../interfaces/orderItem';
import { IOrder } from '../../interfaces/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  placeOrder(orderRequest: IPlaceOrderRequest): Observable<any> {
    return this.http.post<any>('https://localhost:7195/api/Order/PlaceOrder', orderRequest)
      .pipe(catchError(this.errorHandler));
  }

  getOrderItemsByUserId(userId: number): Observable<IOrderItem[]> {
    return this.http.get<IOrderItem[]>(`https://localhost:7195/api/Order/GetOrderItemsByUserId?userId=${userId}`)
      .pipe(catchError(this.errorHandler));
  }

  getOrderDetailsByUserId(userId: number): Observable<IOrder[]> {
    return this.http.get<IOrder[]>(`https://localhost:7195/api/Order/GetOrderDetailsByUserId?userId=${userId}`)
      .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    console.log(error);
    return throwError(error.message || 'ERROR');
  }



}
