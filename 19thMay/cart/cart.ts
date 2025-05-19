import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface CartItem {
  cartItemID: number;
  cartID: number;
  productID: number;
  quantity: number;
  name: string;
  description: string;
  price: number;
  thumbnailURL: string;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  isLoading: boolean = false;
  private userId: number = 1; // This should come from authentication service
  private apiUrl = 'https://localhost:7195/api/Cart';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.isLoading = true;
    this.http.get<CartItem[]>(`${this.apiUrl}/GetCartItems?userId=${this.userId}`)
      .subscribe({
        next: (items) => {
          this.cartItems = items;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading cart items:', error);
          this.isLoading = false;
          // Handle error - maybe show a toast notification
        }
      });
  }

  increaseQuantity(item: CartItem): void {
    const newQuantity = item.quantity + 1;
    this.updateQuantity(item, newQuantity);
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      this.updateQuantity(item, newQuantity);
    }
  }

  private updateQuantity(item: CartItem, newQuantity: number): void {
    // Optimistically update the UI
    const originalQuantity = item.quantity;
    item.quantity = newQuantity;

    // Call API to update quantity
    const updateData = {
      cartItemID: item.cartItemID,
      quantity: newQuantity
    };

    this.http.put(`${this.apiUrl}/UpdateQuantity`, updateData)
      .subscribe({
        next: (response) => {
          // Successfully updated
          console.log('Quantity updated successfully');
        },
        error: (error) => {
          // Revert the optimistic update
          item.quantity = originalQuantity;
          console.error('Error updating quantity:', error);
          // Handle error - maybe show a toast notification
        }
      });
  }

  removeItem(item: CartItem): void {
    // Show confirmation dialog
    if (confirm(`Are you sure you want to remove "${item.name}" from your cart?`)) {
      // Optimistically remove from UI
      const itemIndex = this.cartItems.findIndex(ci => ci.cartItemID === item.cartItemID);
      if (itemIndex > -1) {
        this.cartItems.splice(itemIndex, 1);
      }

      // Call API to remove item
      this.http.delete(`${this.apiUrl}/RemoveItem/${item.cartItemID}`)
        .subscribe({
          next: (response) => {
            console.log('Item removed successfully');
          },
          error: (error) => {
            // Revert the optimistic update
            this.cartItems.splice(itemIndex, 0, item);
            console.error('Error removing item:', error);
            // Handle error - maybe show a toast notification
          }
        });
    }
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getShippingCost(): number {
    // Free shipping for orders above ₹50,000
    const subtotal = this.getSubtotal();
    return subtotal >= 50000 ? 0 : 500;
  }

  getTaxAmount(): number {
    // 18% GST
    const subtotal = this.getSubtotal();
    return subtotal * 0.18;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShippingCost() + this.getTaxAmount();
  }

  continueShopping(): void {
    this.router.navigate(['/products']); // Adjust route as needed
  }

  proceedToCheckout(): void {
    if (this.cartItems.length > 0) {
      // Navigate to checkout page with cart data
      this.router.navigate(['/checkout'], { 
        state: { 
          cartItems: this.cartItems,
          totalAmount: this.getTotal()
        }
      });
    }
  }

  // Method to clear entire cart (if needed)
  clearCart(): void {
    if (confirm('Are you sure you want to clear your entire cart?')) {
      this.http.delete(`${this.apiUrl}/ClearCart/${this.userId}`)
        .subscribe({
          next: (response) => {
            this.cartItems = [];
            console.log('Cart cleared successfully');
          },
          error: (error) => {
            console.error('Error clearing cart:', error);
            // Handle error - maybe show a toast notification
          }
        });
    }
  }

  // Method to refresh cart (if needed)
  refreshCart(): void {
    this.loadCartItems();
  }
}
