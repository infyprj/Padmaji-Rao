import { Component, OnInit } from '@angular/core';
import { IOrder } from '../interfaces/order';
import { IOrderItem } from '../interfaces/orderItem';
import { OrderService } from '../services/order-service/order.service';
import { RatingService } from '../services/rating-service/rating.service';
import { IRatingRequest } from '../interfaces/ratingRequest';

@Component({
  selector: 'app-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.css']
})
export class ViewOrdersComponent implements OnInit {
  orders: IOrder[] = [];
  orderItems: IOrderItem[] = [];
  groupedOrderItems: { [orderId: number]: IOrderItem[] } = {};
  isOrdersLoading: boolean = true;
  isOrderItemsLoading: boolean = true;
  errorMsg: string = '';
  userId: number = 0; 

  // Rating Modal Properties
  showRatingModal: boolean = false;
  currentProductId: number = 0;
  currentProductName: string = '';
  selectedRating: number = 0;
  isSubmittingRating: boolean = false;
  ratingSubmitted: boolean = false;
  ratingError: string = '';

  constructor(private _orderService: OrderService, private _ratingService: RatingService) { } 

  ngOnInit(): void {
    const ui :string= <string>sessionStorage.getItem("userId")
    this.userId = parseInt(ui);

    this.loadOrders();
    this.loadOrderItems();
  }

  loadOrders(): void {
    this.isOrdersLoading = true;
    this._orderService.getOrderDetailsByUserId(this.userId).subscribe(
      (responseData: IOrder[]) => {
        if (responseData.length > 0) {
          this.orders = responseData.sort((a, b) => {
            return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
          });
        } else {
          this.errorMsg = "No Orders found for User";
        }
        this.isOrdersLoading = false;
      },
      (responseError: any) => {
        this.errorMsg = responseError;
        console.log("Error in Getting Orders of the user: " + responseError);
        this.isOrdersLoading = false;
      }
    );
  }

  loadOrderItems(): void {
    this.isOrderItemsLoading = true;
    this._orderService.getOrderItemsByUserId(this.userId).subscribe(
      (responseData: IOrderItem[]) => {
        if (responseData.length > 0) {
          this.orderItems = responseData;
          this.groupOrderItems();
        } else {
          this.errorMsg = "No Order Items found for User";
        }
        this.isOrderItemsLoading = false;
      },
      (responseError: any) => {
        this.errorMsg = responseError;
        console.log("Error in Getting Order Items of the user: " + responseError);
        this.isOrderItemsLoading = false;
      }
    );
  }

  groupOrderItems(): void {
    this.groupedOrderItems = {};
    this.orderItems.forEach(item => {
      if (!this.groupedOrderItems[item.orderId]) {
        this.groupedOrderItems[item.orderId] = [];
      }
      this.groupedOrderItems[item.orderId].push(item);
    });
  }

  getOrderItems(orderId: number): IOrderItem[] {
    return this.groupedOrderItems[orderId] || [];
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  }

  getFullAddress(order: IOrder): string {
    return `${order.shippingAddress}, ${order.shippingCity}, ${order.shippingState} ${order.shippingPostalCode}, ${order.shippingCountry}`;
  }

  onRateProduct(productId: number, productName: string): void {
    this.currentProductId = productId;
    this.currentProductName = productName;
    this.selectedRating = 0;
    this.showRatingModal = true;
    this.ratingSubmitted = false;
    this.ratingError = '';
  }

  onReviewProduct(productId: number): void {
    // Implement review functionality
    console.log('Review product:', productId);
  }

  // Rating Modal Methods
  selectRating(rating: number): void {
    this.selectedRating = rating;
  }

  submitRating(): void {
    if (this.selectedRating === 0) {
      this.ratingError = 'Please select a rating';
      return;
    }

    this.isSubmittingRating = true;
    this.ratingError = '';

    const ratingRequest: IRatingRequest = {
      userId: this.userId,
      productId: this.currentProductId,
      rating: this.selectedRating
    };

    this._ratingService.addRating(ratingRequest).subscribe(
      (response: boolean) => {
        if (response) {
          this.ratingSubmitted = true;
          setTimeout(() => {
            this.closeRatingModal();
          }, 2000);
        } else {
          this.ratingError = 'Failed to submit rating. Please try again.';
        }
        this.isSubmittingRating = false;
      },
      (error: any) => {
        this.ratingError = 'Error submitting rating. Please try again.';
        console.log('Error in submitting rating:', error);
        this.isSubmittingRating = false;
      }
    );
  }

  closeRatingModal(): void {
    this.showRatingModal = false;
    this.selectedRating = 0;
    this.currentProductId = 0;
    this.currentProductName = '';
    this.ratingSubmitted = false;
    this.ratingError = '';
    this.isSubmittingRating = false;
  }

}
