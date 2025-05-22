import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http"
import { throwError, type Observable, catchError, BehaviorSubject } from "rxjs"
import { tap } from 'rxjs/operators';
import { ICartItem, ICartProduct, ICartQuantityUpdate } from "../../interfaces/cart"

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // Add BehaviorSubject for cart count
  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Method to update cart count
  private updateCartCount(count: number): void {
    this.cartCountSubject.next(count);
  }

  // Method to refresh cart count from server
  refreshCartCount(): void {
    this.getCartItems().subscribe(
      items => {
        if (items) {
          this.updateCartCount(items.length);
        }
      },
      error => {
        console.error('Error refreshing cart count:', error);
      }
    );
  }

  addProductToCart(cartItem: ICartItem): Observable<boolean> {
    return this.http.post<boolean>('https://localhost:7195/api/Cart/AddToCart', cartItem).pipe(
      tap(response => {
        // Refresh cart count after successful addition
        if (response) {
          this.refreshCartCount();
        }
      }),
      catchError(this.errorHandler)
    );
  }

  getCartItems(): Observable<ICartProduct[]> {
    const ui: string = <string>sessionStorage.getItem("userId");
    const userId = parseInt(ui);
    return this.http.get<ICartProduct[]>(`https://localhost:7195/api/Cart/GetCartItems?userId=${userId}`).pipe(catchError(this.errorHandler));
  }

  updateCartItemQuantity(cartProduct: ICartQuantityUpdate): Observable<boolean>{
    return this.http.put<boolean>('https://localhost:7195/api/Cart/UpdateCartItemQuantity', cartProduct).pipe(
      tap(response => {
        // Refresh cart count after successful update
        if (response) {
          this.refreshCartCount();
        }
      }),
      catchError(this.errorHandler)
    );
  }

  removeCartItem(cartItemId: number): Observable<boolean> {
    return this.http.delete<boolean>(`https://localhost:7195/api/Cart/RemoveFromCart?cartItemId=${cartItemId}`).pipe(
      tap(response => {
        // Refresh cart count after successful removal
        if (response) {
          this.refreshCartCount();
        }
      }),
      catchError(this.errorHandler)
    );
  }

  clearCart(cartId: number): Observable<boolean> {
    return this.http.delete<boolean>(`https://localhost:7195/api/Cart/ClearCart?cartId=${cartId}`).pipe(
      tap(response => {
        // Reset cart count to 0 after clearing
        if (response) {
          this.updateCartCount(0);
        }
      }),
      catchError(this.errorHandler)
    );
  }

  errorHandler(error: HttpErrorResponse) {
    console.log(error);
    return throwError(error.message || 'ERROR');
  }
}
