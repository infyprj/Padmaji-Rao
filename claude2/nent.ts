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
  product: IProduct | undefined;
  productImages: ProductImage[] = [];
  loading: boolean = true;
  errorMsg: string = '';
  activeImageUrl: string = '';
  quantity: number = 1;

  constructor(
    private _route: ActivatedRoute,
    private _productService: ProductService
  ) { }

  ngOnInit() {
    // Get product ID from route parameter
    const id = Number(this._route.snapshot.paramMap.get('id'));
    if (id) {
      this.getProductDetails(id);
      this.getProductImages(id);
    } else {
      this.errorMsg = 'Invalid product ID';
      this.loading = false;
    }
  }

  getProductDetails(id: number) {
    this._productService.getProductById(id).subscribe(
      responseProductData => {
        this.product = responseProductData;
        this.activeImageUrl = this.product.thumbnailUrl;
        this.loading = false;
      },
      responseProductError => {
        this.errorMsg = responseProductError;
        this.loading = false;
        console.log(this.errorMsg);
      },
      () => { console.log('GetProductDetails method executed successfully'); }
    );
  }

  getProductImages(id: number) {
    this._productService.getProductImages(id).subscribe(
      (responseImagesData: any) => {
        this.productImages = responseImagesData;
      },
      responseImagesError => {
        this.errorMsg = responseImagesError;
        console.log(this.errorMsg);
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
