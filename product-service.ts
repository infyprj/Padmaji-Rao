import { Injectable } from "@angular/core"
import type { HttpClient, HttpErrorResponse } from "@angular/common/http"
import { throwError, type Observable, catchError } from "rxjs"
import { IProduct } from "../../interfaces/product"
//import type { Product } from "../models/product.model"
//import { environment } from "../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class ProductService {
  //private apiUrl = `${environment.apiUrl}/api/product`

  constructor(private http: HttpClient) { }

  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>('http://localhost:7195/api/Product/GetAllProducts').pipe(catchError(this.errorHandler));
  }

  getProductById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`http://localhost:7195/api/Product/GetProductById?id=${id}`).pipe(catchError(this.errorHandler));
  }

  getProductsByCategory(categoryId: number): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`http://localhost:7195/api/Product/GetProductsByCategory?categoryId=${categoryId}`).pipe(catchError(this.errorHandler));
  }

  getProductsByPriceRange(minPrice: number, maxPrice: number): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`http://localhost:7195/api/Product/GetProductsByPriceRange?minPrice=${minPrice}&maxPrice=${maxPrice}`).pipe(catchError(this.errorHandler));
  }

  getSearchProducts(item: string): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(`http://localhost:7195/api/Product/SearchProducts?searchTerm=${item}`).pipe(catchError(this.errorHandler));
  }

  addProduct(product: IProduct): Observable<IProduct> {
    return this.http.post<IProduct>(`http://localhost:7195/api/Product/AddProduct`, product).pipe(catchError(this.errorHandler));
  }

  updateProduct(product: IProduct): Observable<IProduct> {
    return this.http.put<IProduct>(`http://localhost:7195/api/Product/UpdateProduct`, product).pipe(catchError(this.errorHandler));
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:7195/api/Product/DeleteProduct?id=${id}`).pipe(catchError(this.errorHandler));
  }

  getProductImages(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`http://localhost:7195/api/Product/GetProductImages?productId=${id}`).pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    console.log(error);
    return throwError(error.message || 'ERROR');
  }
}

