import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../services/cart-service/cart.service';
import { ProductService } from '../services/product-service/product.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  userRoleId: number = 0;
  userId: number = 0;
  guestNavbarShow: boolean = false;
  customerNavbarShow: boolean = false;
  adminNavbarShow: boolean = false;
  cartCount: number = 0;
  wishlistCount: number = 0;

  showMenu = false;
  showDropdown = false;

  // Add subscriptions for cleanup
  private cartCountSubscription: Subscription = new Subscription();
  private wishlistCountSubscription: Subscription = new Subscription();

  constructor(private router: Router, private _productService: ProductService, private _cartService: CartService) { }

  ngOnInit(): void {
    const uri: string = <string>sessionStorage.getItem('userRoleId');
    const ui: string = <string>sessionStorage.getItem('userId');
    this.userRoleId = parseInt(uri);
    this.userId = parseInt(ui);
    
    if (this.userRoleId === 2) {
      this.customerNavbarShow = true;
    }
    else if (this.userRoleId === 3) {
      this.adminNavbarShow = true;
    }
    else {
      this.guestNavbarShow = true;
    }
    
    // Subscribe to count changes if user is logged in
    if (this.userId) {
      this.subscribeToCountChanges();
      // Initialize counts
      this._productService.refreshWishlistCount(this.userId);
      this._cartService.refreshCartCount();
    }
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.cartCountSubscription.unsubscribe();
    this.wishlistCountSubscription.unsubscribe();
  }

  // Subscribe to count changes from services
  private subscribeToCountChanges(): void {
    this.cartCountSubscription = this._cartService.cartCount$.subscribe(
      count => {
        this.cartCount = count;
      }
    );

    this.wishlistCountSubscription = this._productService.wishlistCount$.subscribe(
      count => {
        this.wishlistCount = count;
      }
    );
  }

  // Remove the old getCounts method as it's no longer needed

  isActiveLink(route: string): boolean {
    return this.router.url === route;
  }

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  clickDropdown(): void {
    this.showDropdown = true;
  }

  onHover(): void {
    this.showDropdown = true;
  }

  onMouseLeave(): void {
    this.showDropdown = false;
  }

  onClickLogout(): void {
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userRoleId")
    
    // Reset counts and unsubscribe
    this.cartCount = 0;
    this.wishlistCount = 0;
    this.cartCountSubscription.unsubscribe();
    this.wishlistCountSubscription.unsubscribe();
    
    this.router.navigate(['login']);
    this.adminNavbarShow = false;
    this.guestNavbarShow = false;
    this.customerNavbarShow = false;
    this.ngOnInit();
  }
}
