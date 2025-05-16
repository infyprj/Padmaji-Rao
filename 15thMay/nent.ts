import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct } from '../interfaces/product';
import { ISavedProduct } from '../interfaces/saved-product'
import { ProductService } from '../services/product-service/product.service';


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
  is3DViewActive = false
  modelUrl = "https://modelviewer.dev/shared-assets/models/Astronaut.glb" // Default model URL
  showToast = false;
  toastMessage = "";
  toastStatus = 0; // 0 = already added (orange), 1 = successfully added (green)



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _productService: ProductService,
    private elementRef: ElementRef,
  ) { }

  ngOnInit(): void {

    // First approach: Using snapshot
    this.productId = +this.route.snapshot.params['id'];


    // Second approach: Using paramMap observable


    if (this.productId) {
      this.getProductDetails(this.productId);
      this.getProductImages(this.productId);
      } else {
        this.errorMsg = 'Invalid product ID';
        this.loading = false;
      }

  }
  ngAfterViewInit() {
    // Load the model-viewer script
    this.loadModelViewerScript()
  }

  loadModelViewerScript() {
    const script = document.createElement("script")
    script.type = "module"
    script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"
    document.body.appendChild(script)
  }

  getProductDetails(id: number) {
    console.log("Fetching product details for ID:", id);
    this._productService.getProductById(id).subscribe(
      responseProductData => {
        console.log("Product data received:", responseProductData);
        this.product = responseProductData;
        if (this.product) {
          this.activeImageUrl = this.product.thumbnailUrl;
          this.modelUrl = this.product.modelUrl || this.modelUrl;

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
    if (this.is3DViewActive) {
      this.is3DViewActive = false;
    }
  }

  active3DView() {
    this.is3DViewActive = true;

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


  addToWhishlist() {
    if (this.product) {
      const wishlistProduct: ISavedProduct = {
        userId: 4,
        productId: this.product.productId
      }
      this._productService.addProductToWishlist(wishlistProduct).subscribe(
        responseData => {
          if (responseData) {
            // Product successfully added - show green toast
            this.showToastMessage("Product Added to Wishlist", 1)
          } else {
            // Product already added - show orange toast
            this.showToastMessage("Already Added to Wishlist", 0)
          }
        },
        responseError => {
          this.errorMsg = responseError
          console.error("Error Wishlisting product:", this.errorMsg);
        },
        () => { console.log("Add to Wishlist successfully executed!!"); }
      )
    }
  }


  showToastMessage(message: string, status: number) {
    this.toastMessage = message;
    this.toastStatus = status; // 0 = already added (orange), 1 = successfully added (green)
    this.showToast = true;
    
    setTimeout(() => {
      // Add the hide class first to animate the toast sliding up
      const toastElement = this.elementRef.nativeElement.querySelector('.toast');
      if (toastElement) {
        toastElement.classList.add('hide');
      }
      
      // Then hide the toast after animation completes
      setTimeout(() => {
        this.showToast = false;
      }, 300); // Match this with the slideUp animation duration
    }, 2000);
  }
}