import { Component, type OnInit, type AfterViewInit, type ElementRef } from "@angular/core"
import type { ActivatedRoute, Router } from "@angular/router"
import type { IProduct } from "../interfaces/product"
import type { ProductService } from "../services/product-service/product.service"

interface ProductImage {
  imageId: number
  productId: number
  imageUrl: string
}

@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.component.html",
  styleUrls: ["./product-detail.component.css"],
})
export class ProductDetailComponent implements OnInit, AfterViewInit {
  product: IProduct | undefined
  productImages: ProductImage[] = []
  loading = true
  errorMsg = ""
  activeImageUrl = ""
  quantity = 1
  productId = 0
  is3DViewActive = false
  modelUrl = "https://modelviewer.dev/shared-assets/models/Astronaut.glb" // Default model URL

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _productService: ProductService,
    private elementRef: ElementRef,
  ) {}

  ngOnInit(): void {
    // First approach: Using snapshot
    this.productId = +this.route.snapshot.params["id"]

    if (this.productId) {
      this.getProductDetails(this.productId)
      this.getProductImages(this.productId)
    } else {
      this.errorMsg = "Invalid product ID"
      this.loading = false
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
    console.log("Fetching product details for ID:", id)
    this._productService.getProductById(id).subscribe(
      (responseProductData) => {
        console.log("Product data received:", responseProductData)
        this.product = responseProductData
        if (this.product) {
          this.activeImageUrl = this.product.thumbnailUrl

          // You might want to set the 3D model URL based on product data
          // For example, if your product has a modelUrl property:
          // this.modelUrl = this.product.modelUrl || this.modelUrl;
        }
        this.loading = false
      },
      (responseProductError) => {
        this.errorMsg = responseProductError
        this.loading = false
        console.error("Error fetching product:", this.errorMsg)
      },
      () => {
        console.log("GetProductDetails method executed successfully")
      },
    )
  }

  getProductImages(id: number) {
    console.log("Fetching product images for ID:", id)
    this._productService.getProductImages(id).subscribe(
      (responseImagesData: any) => {
        console.log("Product images received:", responseImagesData)
        this.productImages = responseImagesData
      },
      (responseImagesError) => {
        this.errorMsg = responseImagesError
        console.error("Error fetching images:", this.errorMsg)
      },
      () => {
        console.log("GetProductImages method executed successfully")
      },
    )
  }

  setActiveImage(imageUrl: string) {
    this.activeImageUrl = imageUrl
    this.is3DViewActive = false // Deactivate 3D view when selecting a regular image
  }

  toggle3DView() {
    this.is3DViewActive = !this.is3DViewActive
    if (!this.is3DViewActive) {
      // If turning off 3D view, revert to the main image
      this.activeImageUrl = this.product?.thumbnailUrl || ""
    }
  }

  incrementQuantity() {
    if (this.product && this.quantity < this.product.quantity) {
      this.quantity++
    }
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--
    }
  }

  addToCart() {
    if (this.product) {
      alert(`${this.quantity} item(s) of ${this.product.name} added to cart!`)
      // Here you would implement the actual cart functionality
    }
  }
}
