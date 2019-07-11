import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';


import { AppRoutingModule } from '../app-routing.module';
import * as ProductsStore from './store/products.reducer';
import { ProductsComponent } from './components/products/products.component';
import { ProductAddComponent } from './components/product-add/product-add.component';
import { ProductEditComponent } from './components/product-edit/product-edit.component';
import { DigitOnlyDirective } from './divectives/digit-only.directive';
import { metaReducers } from './store/meta-reducer';

@NgModule({
  declarations: [
    ProductsComponent,
    ProductAddComponent,
    ProductEditComponent,
    DigitOnlyDirective
  ],
  imports: [
    CommonModule,
    AppRoutingModule,    
    FormsModule,
    StoreModule.forFeature('products', ProductsStore.reducer, { metaReducers })
  ],
})
export class ProductModule { }
