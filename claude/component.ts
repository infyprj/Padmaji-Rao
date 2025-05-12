import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  modelUrl: string;
  thumbnailUrl: string;
  quantity: number;
  productImages: ProductImage[];
}

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  selectedImage: string = '';
  isLoading: boolean = true;
  modelViewerUrl: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // Extract product ID from route parameter
    const productId = this.route.snapshot.paramMap.get('id');
    
    if (productId) {
      this.fetchProductDetails(parseInt(productId, 10));
    }
  }

  fetchProductDetails(id: number): void {
    this.isLoading = true;
    this.http.get<Product>(`/api/ProductController/GetProductById?id=${id}`)
      .subscribe({
        next: (product) => {
          this.product = product;
          
          // Sanitize the 3D model URL
          if (product.modelUrl) {
            this.modelViewerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(product.modelUrl);
          }
          
          // Set first image as selected if images exist
          if (product.productImages && product.productImages.length > 0) {
            this.selectedImage = product.productImages[0].imageUrl;
          } else {
            this.selectedImage = product.thumbnailUrl;
          }
          
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching product details:', error);
          this.isLoading = false;
        }
      });
  }

  selectImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }

  addToCart(): void {
    // Implement add to cart functionality
    // This would typically involve a service call to manage cart state
    console.log('Product added to cart:', this.product);
  }

  buyNow(): void {
    // Implement buy now functionality
    // This would typically involve navigation to checkout or creating an order
    console.log('Buying product:', this.product);
  }
}
