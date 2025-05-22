import { Injectable } from "@angular/core"
import  { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http"
import { throwError, type Observable, catchError, BehaviorSubject } from "rxjs"
import { tap } from 'rxjs/operators';
import { IProduct } from "../../interfaces/product"
import { ISavedProduct } from "../../interfaces/saved-product";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  
  // Add BehaviorSubject for wishlist count
  private wishlistCountSubject = new BehaviorSubject<number>(0);
  public wishlistCount$ = this.wishlistCountSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Method to update wishlist count
  private updateWishlistCount(count: number): void {
    this.wishlistCountSubject.next(count);
  }

  // Method to refresh wishlist count from server
  refreshWishlistCount(userId: number): void {
    this.getSavedProducts(userId).subscribe(
      products => {
        if (products) {
          this.updateWishlistCount(products.length);
        }
      },
      error => {
        console.error('Error refreshing wishlist count:', error);
      }
    );
  }

  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>('https://localhost:7195/api/Product/GetAllProducts').pipe(catchError(this.errorHandler));
  }

  getProductById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`https://localhost:7195/api/Product/GetProductById?id=${id}`).pipe(catchError(this.errorHandler));
  }

  getProductsByCategory(categoryId: number): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`https://localhost:7195/api/Product/GetProductsByCategory?categoryId=${categoryId}`).pipe(catchError(this.errorHandler));
  }

  getProductsByPriceRange(minPrice: number, maxPrice: number): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`https://localhost:7195/api/Product/GetProductsByPriceRange?minPrice=${minPrice}&maxPrice=${maxPrice}`).pipe(catchError(this.errorHandler));
  }

  getSearchProducts(item: string): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`https://localhost:7195/api/Product/SearchProducts?searchTerm=${item}`).pipe(catchError(this.errorHandler));
  }

  getSavedProducts(id: number): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`https://localhost:7195/api/SavedProduct/GetSavedProducts?userId=${id}`).pipe(catchError(this.errorHandler));
  }

  addProduct(product: IProduct): Observable<IProduct> {
    return this.http.post<IProduct>(`https://localhost:7195/api/Product/AddProduct`, product).pipe(catchError(this.errorHandler));
  }

  updateProduct(product: IProduct): Observable<boolean> {
    return this.http.put<boolean>(`https://localhost:7195/api/Product/UpdateProduct`, product).pipe(catchError(this.errorHandler));
  }

  deleteProduct(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`https://localhost:7195/api/Product/DeleteProduct?id=${id}`).pipe(catchError(this.errorHandler));
  }

  removeSavedProduct(userIdd:number,productIdd:number): Observable<boolean> {
    var s: ISavedProduct = {
      userId: userIdd,
      productId: productIdd
    };
    let HttpOptions = { Headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: s };
    return this.http.delete<boolean>(`https://localhost:7195/api/SavedProduct/RemoveSavedProduct`, HttpOptions).pipe(
      tap(response => {
        // Refresh wishlist count after successful removal
        if (response) {
          this.refreshWishlistCount(userIdd);
        }
      }),
      catchError(this.errorHandler)
    );
  }

  getProductImages(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`https://localhost:7195/api/Product/GetProductImages?productId=${id}`).pipe(catchError(this.errorHandler));
  }

  addProductToWishlist(whishlistProduct: ISavedProduct): Observable<boolean> {
    return this.http.post<boolean>(`https://localhost:7195/api/SavedProduct/SaveProduct`, whishlistProduct).pipe(
      tap(response => {
        // Refresh wishlist count after successful addition
        if (response) {
          this.refreshWishlistCount(whishlistProduct.userId);
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
