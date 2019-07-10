import { Component, OnInit } from '@angular/core';

import { Product } from '../../model/product';
import { ProductService } from '../../services/product.service';
import { Observable, from } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: Product[];
  dataSource: Observable<Product>; 

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.products = null;
    var sub = this.productService.getProducts()
      .subscribe(
        products => {
          this.setProducts(products);
          sub.unsubscribe();
        }
      );    
  }
  
  setProducts(products: Product[]) : void {
    this.products = products;
  }

}
