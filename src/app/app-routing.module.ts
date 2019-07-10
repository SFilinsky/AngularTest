import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductsComponent } from './product/components/products/products.component';
import { ProductAddComponent } from './product/components/product-add/product-add.component';
import { ProductEditComponent } from './product/components/product-edit/product-edit.component';


const routes: Routes = [
  { path: '', redirectTo:'/products', pathMatch: 'full' },
  { path: 'products',  component: ProductsComponent },
  { path: 'addProduct',  component: ProductAddComponent },  
  { path: 'products/:id',  component: ProductEditComponent },
];  
@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule { }
