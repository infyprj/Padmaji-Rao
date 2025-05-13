import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from '../../interfaces/product';
import { ProductService } from '../../services/product-service';

interface ProductImage {
  imageId: number;
  productId: number;
  imageUrl: string;
}

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: IProduct | null = null;
  productImages: ProductImage[] = [];
  loading: boolean = true;
  errorMsg: string = '';
  activeImageUrl: string = '';
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = +params['id']; // Convert string to number
      if (productId) {
        this.loadProductDetails(productId);
        this.loadProductImages(productId);
      }
    });
  }

  loadProductDetails(productId: number): void {
    this.loading = true;
    this.productService.getProductById(productId).subscribe(
      (response) => {
        this.product = response;
        this.activeImageUrl = this.product.thumbnailUrl;
        this.loading = false;
      },
      (error) => {
        this.errorMsg = error;
        this.loading = false;
        console.error('Error loading product details:', error);
      }
    );
  }

  loadProductImages(productId: number): void {
    this.productService.getProductImages(productId).subscribe(
      (response: any) => {
        this.productImages = response;
      },
      (error) => {
        console.error('Error loading product images:', error);
      }
    );
  }

  setActiveImage(imageUrl: string): void {
    this.activeImageUrl = imageUrl;
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.quantity) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.product) {
      // Implement your add to cart functionality here
      alert(`Added ${this.quantity} of ${this.product.name} to cart`);
    }
  }
}
