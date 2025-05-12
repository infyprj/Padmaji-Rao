import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// Product interface matching your backend model
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryID: number;
  modelURL: string;
  thumbnailURL: string;
  quantity: number;
  productImages?: ProductImage[];
}

interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  isMainImage: boolean;
}

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit, AfterViewInit {
  product: Product | null = null;
  loading = true;
  modelLoading = true;
  selectedImageIndex = 0;
  error: string | null = null;
  
  // For model-viewer
  @ViewChild('modelViewer') modelViewer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      if (productId) {
        this.fetchProductDetails(productId);
      }
    });
  }

  ngAfterViewInit(): void {
    // Add event listeners to model-viewer after view init if needed
    if (this.modelViewer?.nativeElement) {
      this.modelViewer.nativeElement.addEventListener('load', () => {
        this.modelLoading = false;
      });
      
      this.modelViewer.nativeElement.addEventListener('error', () => {
        this.error = 'Failed to load 3D model';
        this.modelLoading = false;
      });
    }
  }

  fetchProductDetails(productId: number): void {
    this.loading = true;
    this.http.get<Product>(`/api/Product/GetProductById?id=${productId}`)
      .subscribe({
        next: (data) => {
          this.product = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching product details:', err);
          this.error = 'Failed to load product details';
          this.loading = false;
        }
      });
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  getSanitizedModelUrl(): SafeResourceUrl | null {
    if (!this.product?.modelURL) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.product.modelURL);
  }

  // Helper methods for product display
  getMainImage(): string {
    if (this.product?.thumbnailURL) {
      return this.product.thumbnailURL;
    }
    
    if (this.product?.productImages && this.product.productImages.length > 0) {
      const mainImage = this.product.productImages.find(img => img.isMainImage);
      if (mainImage) return mainImage.imageUrl;
      return this.product.productImages[0].imageUrl;
    }
    
    return 'assets/placeholder-image.png';
  }

  getAllImages(): string[] {
    const images: string[] = [];
    
    if (this.product?.thumbnailURL) {
      images.push(this.product.thumbnailURL);
    }
    
    if (this.product?.productImages) {
      this.product.productImages.forEach(img => {
        if (!images.includes(img.imageUrl)) {
          images.push(img.imageUrl);
        }
      });
    }
    
    return images.length > 0 ? images : ['assets/placeholder-image.png'];
  }

  addToCart(): void {
    // Implement add to cart functionality
    console.log('Added to cart:', this.product?.name);
    // You would typically dispatch an action to your cart service here
  }
}
