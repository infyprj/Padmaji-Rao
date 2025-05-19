import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ViewWishlistComponent } from './view-wishlist/view-wishlist.component';
import { ViewCartComponent } from './view-cart/view-cart.component';
import { ProductSearchComponent } from './product-search/product-search.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UpdateProductComponent } from './update-product/update-product.component';
import { AddProductComponent } from './add-product/add-product.component';

const routes: Routes = [
  { path: '', component: ProductSearchComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'update-product/:productId/:name/:description/:price/:categoryId/:modelUrl/:thumbnailUrl/:quantity', component: UpdateProductComponent },
  { path: 'wishlist', component: ViewWishlistComponent },
  { path: 'add-product', component: AddProductComponent },
  { path: 'cart', component: ViewCartComponent },
  { path: 'products', component: ProductSearchComponent },
  { path: 'update-user', component: UserProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: RegisterComponent },
  { path: '**', component: ProductSearchComponent },

]

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forRoot(routes)

