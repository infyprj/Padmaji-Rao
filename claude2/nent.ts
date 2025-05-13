import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  product: IProduct | undefined;
  productImages: ProductImage[] = [];
  loading: boolean = true;
  errorMsg: string = '';
  activeImageUrl: string = '';
  quantity: number = 1;
  productId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _productService: ProductService
  ) { }

  ngOnInit(): void {
    console.log("In ngOnInit");
    
    // First approach: Using snapshot
    const idParam = this.route.snapshot.paramMap.get('id');
    console.log("ID from snapshot:", idParam);
    
    // Second approach: Using paramMap observable
    this.route.paramMap.subscribe(params => {
      console.log("ID from paramMap observable:", params.get('id'));
      const id = Number(params.get('id'));
      this.productId = id;
      
      if (id) {
        this.getProductDetails(id);
        this.getProductImages(id);
      } else {
        this.errorMsg = 'Invalid product ID';
        this.loading = false;
      }
    });
  }

  getProductDetails(id: number) {
    console.log("Fetching product details for ID:", id);
    this._productService.getProductById(id).subscribe(
      responseProductData => {
        console.log("Product data received:", responseProductData);
        this.product = responseProductData;
        if (this.product) {
          this.activeImageUrl = this.product.thumbnailUrl;
        }
        this.loading = false;
      },
      responseProductError => {
        this.errorMsg = responseProductError;
        this.loading = false;
        console.error("Error fetching product:", this.errorMsg);
      },
      () => { console.log('GetProductDetails method executed successfully'); }
    );
  }

  getProductImages(id: number) {
    console.log("Fetching product images for ID:", id);
    this._productService.getProductImages(id).subscribe(
      (responseImagesData: any) => {
        console.log("Product images received:", responseImagesData);
        this.productImages = responseImagesData;
      },
      responseImagesError => {
        this.errorMsg = responseImagesError;
        console.error("Error fetching images:", this.errorMsg);
      },
      () => { console.log('GetProductImages method executed successfully'); }
    );
  }

  setActiveImage(imageUrl: string) {
    this.activeImageUrl = imageUrl;
  }

  incrementQuantity() {
    if (this.product && this.quantity < this.product.quantity) {
      this.quantity++;
    }
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (this.product) {
      alert(`${this.quantity} item(s) of ${this.product.name} added to cart!`);
      // Here you would implement the actual cart functionality
    }
  }
}
