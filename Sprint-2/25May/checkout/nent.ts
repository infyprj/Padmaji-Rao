import { Component, OnInit } from '@angular/core';

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

export interface ICartItem {
  cartItemId: number;
  cartId: number;
  productId: number;
  quantity: number;
  name: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  subTotal: number;
}

@Component({
  selector: 'app-view-checkout',
  templateUrl: './view-checkout.component.html',
  styleUrls: ['./view-checkout.component.css']
})
export class ViewCheckoutComponent implements OnInit {
  
  addresses: IAddress[] = [];
  cartItems: ICartItem[] = [];
  selectedAddressId: number | null = null;
  userId: number = 1; // Get from auth service
  cartId: number = 1; // Get from cart service
  
  // Modal states
  showAddressModal: boolean = false;
  showDeleteModal: boolean = false;
  addressToDelete: number | null = null;
  
  // Address form
  addressForm: IAddress = {
    userId: this.userId,
    name: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  };
  
  isEditMode: boolean = false;
  
  // Order calculations
  subtotal: number = 0;
  shippingCharges: number = 500;
  gstRate: number = 0.18;
  freeShippingThreshold: number = 50000;
  
  constructor(
    // Inject your services here
    // private addressService: AddressService,
    // private cartService: CartService,
    // private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.loadAddresses();
    this.loadCartItems();
  }

  loadAddresses(): void {
    // Mock data - replace with actual service call
    this.addresses = [
      {
        addressId: 1,
        userId: 1,
        name: 'John Doe',
        phoneNumber: '9876543210',
        address: '123 Main Street, Apartment 4B',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India'
      },
      {
        addressId: 2,
        userId: 1,
        name: 'John Doe',
        phoneNumber: '9876543210',
        address: '456 Business Complex, Office 201',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400002',
        country: 'India'
      }
    ];
    
    // Select first address by default
    if (this.addresses.length > 0) {
      this.selectedAddressId = this.addresses[0].addressId!;
    }
  }

  loadCartItems(): void {
    // Mock data - replace with actual service call
    this.cartItems = [
      {
        cartItemId: 1,
        cartId: 1,
        productId: 1,
        quantity: 2,
        name: 'Velvet Elegance Two-Seater',
        description: 'Luxury sofa',
        price: 15000,
        thumbnailUrl: 'https://shop3dprojectaccount.blob.core.windows.net/images/Sofa1.png',
        subTotal: 30000
      },
      {
        cartItemId: 2,
        cartId: 1,
        productId: 2,
        quantity: 1,
        name: 'Catalina Office Desk',
        description: 'Office desk',
        price: 6000,
        thumbnailUrl: 'https://shop3dprojectaccount.blob.core.windows.net/images/Table.png',
        subTotal: 6000
      }
    ];
    
    this.calculateTotals();
  }

  calculateTotals(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + item.subTotal, 0);
    this.shippingCharges = this.subtotal >= this.freeShippingThreshold ? 0 : 500;
  }

  get gstAmount(): number {
    return (this.subtotal + this.shippingCharges) * this.gstRate;
  }

  get orderTotal(): number {
    return this.subtotal + this.shippingCharges + this.gstAmount;
  }

  get isShippingFree(): boolean {
    return this.subtotal >= this.freeShippingThreshold;
  }

  selectAddress(addressId: number): void {
    this.selectedAddressId = addressId;
  }

  openAddressModal(address?: IAddress): void {
    this.isEditMode = !!address;
    if (address) {
      this.addressForm = { ...address };
    } else {
      this.resetAddressForm();
    }
    this.showAddressModal = true;
  }

  closeAddressModal(): void {
    this.showAddressModal = false;
    this.resetAddressForm();
  }

  resetAddressForm(): void {
    this.addressForm = {
      userId: this.userId,
      name: '',
      phoneNumber: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India'
    };
  }

  saveAddress(): void {
    if (this.isEditMode) {
      // Update address logic
      const index = this.addresses.findIndex(addr => addr.addressId === this.addressForm.addressId);
      if (index !== -1) {
        this.addresses[index] = { ...this.addressForm };
      }
    } else {
      // Add new address logic
      const newAddress = { 
        ...this.addressForm, 
        addressId: Date.now() // Mock ID
      };
      this.addresses.push(newAddress);
    }
    this.closeAddressModal();
  }

  confirmDeleteAddress(addressId: number): void {
    this.addressToDelete = addressId;
    this.showDeleteModal = true;
  }

  deleteAddress(): void {
    if (this.addressToDelete) {
      this.addresses = this.addresses.filter(addr => addr.addressId !== this.addressToDelete);
      if (this.selectedAddressId === this.addressToDelete) {
        this.selectedAddressId = this.addresses.length > 0 ? this.addresses[0].addressId! : null;
      }
    }
    this.showDeleteModal = false;
    this.addressToDelete = null;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.addressToDelete = null;
  }

  placeOrder(): void {
    if (!this.selectedAddressId) {
      alert('Please select a delivery address');
      return;
    }

    const orderRequest = {
      userId: this.userId,
      cartId: this.cartId,
      addressId: this.selectedAddressId
    };

    // Call order service
    console.log('Placing order:', orderRequest);
    // this.orderService.placeOrder(orderRequest).subscribe(
    //   response => {
    //     if (response.returnCode === 1) {
    //       // Order placed successfully
    //       alert('Order placed successfully!');
    //     } else {
    //       // Handle error cases
    //       this.handleOrderError(response.returnCode);
    //     }
    //   },
    //   error => {
    //     console.error('Error placing order:', error);
    //     alert('Failed to place order. Please try again.');
    //   }
    // );
  }

  private handleOrderError(returnCode: number): void {
    switch (returnCode) {
      case -1:
        alert('User does not exist');
        break;
      case -2:
        alert('Cart does not exist or does not belong to user');
        break;
      case -3:
        alert('Address does not exist or does not belong to user');
        break;
      case -4:
        alert('Cart is empty');
        break;
      case -5:
        alert('Insufficient product quantity');
        break;
      default:
        alert('An error occurred while placing the order');
    }
  }
}
