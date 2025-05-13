import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product-service';
import { IProduct } from '../../interfaces/product';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// Import model-viewer
import '@google/model-viewer';

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
export class ProductDetailComponent implements OnInit, AfterViewInit {
  product: IProduct | null = null;
  productImages: ProductImage[] = [];
  loading: boolean = true;
  modelLoading: boolean = true;
  imageLoading: boolean = true;
  errorMsg: string = '';
  currentImageIndex: number = 0;
  modelViewerLoaded: boolean = false;
  
  constructor(
    private _route: ActivatedRoute,
    private _productService: ProductService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    // Get the product ID from the route parameters
    this._route.params.subscribe(params => {
      const productId = +params['id']; // Convert to number
      if (productId) {
        this.getProductDetails(productId);
        this.getProductImages(productId);
      }
    });
  }

  ngAfterViewInit() {
    // Add event listener for model-viewer loaded event
    document.addEventListener('load', (event) => {
      if (event.target && (event.target as HTMLElement).tagName === 'MODEL-VIEWER') {
        this.modelLoading = false;
        this.modelViewerLoaded = true;
      }
    }, true);
  }

  getProductDetails(productId: number) {
    this._productService.getProductById(productId).subscribe(
      responseProductData => {
        this.product = responseProductData;
        this.loading = false;
        console.log('Product details loaded successfully');
      },
      responseProductError => {
        this.errorMsg = responseProductError;
        this.loading = false;
        console.log(this.errorMsg);
      }
    );
  }

  getProductImages(productId: number) {
    this._productService.getProductImages(productId).subscribe(
      (responseImageData: any) => {
        this.productImages = responseImageData;
        this.imageLoading = false;
        console.log('Product images loaded successfully');
      },
      responseImageError => {
        this.errorMsg = responseImageError;
        this.imageLoading = false;
        console.log(this.errorMsg);
      }
    );
  }

  // Method to handle 3D model loading
  onModelLoad() {
    this.modelLoading = false;
    console.log('3D model loaded successfully');
  }

  // Method to handle 3D model loading error
  onModelError() {
    this.modelLoading = false;
    this.errorMsg = 'Failed to load 3D model';
    console.log(this.errorMsg);
  }

  // Method to navigate through product images
  showImage(index: number) {
    this.currentImageIndex = index;
  }

  // Method to get next image
  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.productImages.length;
  }

  // Method to get previous image
  prevImage() {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.productImages.length) % this.productImages.length;
  }

  // Method to add product to cart (placeholder for future implementation)
  addToCart() {
    if (this.product) {
      alert(`Added ${this.product.name} to cart!`);
      // Implement actual cart functionality here
    }
  }

  // Method to sanitize the model URL for security
  getSafeModelUrl(): SafeResourceUrl | null {
    return this.product?.modelUrl ? this.sanitizer.bypassSecurityTrustResourceUrl(this.product.modelUrl) : null;
  }
}
