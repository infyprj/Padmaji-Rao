// address.service.ts

getAddressesByUserId(userId: number): Observable<IAddress[]> {
  return this.http.get<IAddress[]>(`https://localhost:7195/api/Address/GetAddressesByUserId/${userId}`)
    .pipe(catchError(this.errorHandler));
}

addNewAddress(address: IAddress): Observable<any> {
  return this.http.post<any>('https://localhost:7195/api/Address/AddNewAddress', address)
    .pipe(catchError(this.errorHandler));
}

updateAddress(address: IAddress): Observable<any> {
  return this.http.put<any>('https://localhost:7195/api/Address/UpdateAddress', address)
    .pipe(catchError(this.errorHandler));
}

removeAddress(addressId: number): Observable<any> {
  return this.http.delete<any>(`https://localhost:7195/api/Address/RemoveAddress/${addressId}`)
    .pipe(catchError(this.errorHandler));
}

// order.service.ts

placeOrder(orderRequest: IPlaceOrderRequest): Observable<any> {
  return this.http.post<any>('https://localhost:7195/api/Order/PlaceOrder', orderRequest)
    .pipe(catchError(this.errorHandler));
}

getOrderItemsByUserId(userId: number): Observable<IOrderItem[]> {
  return this.http.get<IOrderItem[]>(`https://localhost:7195/api/Order/GetOrderItemsByUserId/${userId}`)
    .pipe(catchError(this.errorHandler));
}

getOrderDetailsByUserId(userId: number): Observable<IOrder[]> {
  return this.http.get<IOrder[]>(`https://localhost:7195/api/Order/GetOrderDetailsByUserId/${userId}`)
    .pipe(catchError(this.errorHandler));
}

// product.service.ts (add to existing service)

getProductStock(productId: number): Observable<any> {
  return this.http.get<any>(`https://localhost:7195/api/Product/GetProductStock/${productId}`)
    .pipe(catchError(this.errorHandler));
}

// rating.service.ts

addRating(ratingRequest: IRatingRequest): Observable<any> {
  return this.http.post<any>('https://localhost:7195/api/Rating/AddRating', ratingRequest)
    .pipe(catchError(this.errorHandler));
}

// Error handler (common for all services)
errorHandler(error: HttpErrorResponse) {
  console.log(error);
  return throwError(error.message || 'ERROR');
}

// Interfaces (add these to your models/interfaces)

export interface IAddress {
  addressId?: number;
  userId: number;
  name: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IPlaceOrderRequest {
  userId: number;
  cartId: number;
  addressId: number;
}

export interface IOrderItem {
  orderItemId: number;
  orderId: number;
  productId: number;
  productName: string;
  thumbnailUrl: string;
  quantity: number;
  unitPrice: number;
}

export interface IOrder {
  orderId: number;
  userId: number;
  orderDate: Date;
  totalAmount: number;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
  name: string;
  phoneNumber: string;
}

export interface IRatingRequest {
  userId: number;
  productId: number;
  rating: number;
}
