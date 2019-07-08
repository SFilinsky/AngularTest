import { Component, OnInit } from '@angular/core';

import { Product } from '../classes/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: Product[];

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.products = null;
    this.productService.getProducts()
      .subscribe(
        products => this.setProducts(products)
      );    
  }

  setProducts(products: Product[]) : void {
    this.products = products;
  }

}
