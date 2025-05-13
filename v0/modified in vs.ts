import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  imageId: number;
  productId: number;
  imageUrl: string;
  
}


@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.css']
})
export class ViewProductComponent implements OnInit, AfterViewInit {
  product: Product | null = null;
  loading = true;
  modelLoading = true;
  selectedImageIndex = 0;
  error: string | null = null;

  @ViewChild('modelViewer') modelViewer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    
    this.route.params.subscribe(params => {
      const productId = 1;
      console.log("In ngOnit");
      console.log("Product Id :" + productId);
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
    console.log("In Fetch Product Details");
    this.product = {
      id: 1,
      "name": "sofa1",
      "description": "Wood Velvet 2 seater Sofa for Living Room",
      "price": 15000,
      "categoryID": 1,
      "modelURL": "https://shop3dprojectaccount.blob.core.windows.net/3d-models/Sofa1.glb",
      "thumbnailURL": "https://shop3dprojectaccount.blob.core.windows.net/images/Sofa1.png",
      "quantity": 20
    }
    this.loading = false;
    //this.http.get<Product>(`https://localhost:7195/api/ProductProduct/GetProductById?id=${productId}`)
    //  .subscribe(
    //    responseData => {
    //      this.product = responseData;
    //      console.log("After response data");
    //      this.loading = false;
    //    },
    //    responseError=>{
    //      console.error('Error fetching product details:', responseError);
    //      this.error = 'Failed to load product details';
    //      this.loading = false;
    //    },
    //    () => { console.log("View Product Successfully Executed!"); }
        
    //  );
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
      const mainImage = this.product.productImages[0];
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
