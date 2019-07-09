import { Component, OnInit } from '@angular/core';

import { Product } from '../classes/product';
import { ProductService } from '../services/product.service';
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
    this.productService.getProducts()
      .subscribe(
        products => this.setProducts(products)
      );    
  }
  
  setProducts(products: Product[]) : void {
    console.log(JSON.stringify(products));
    this.products = products.filter(function(elem, index, self) {
      return (self.filter( x => (x.id === elem.id) && (self.indexOf(x) < index)).length === 0);
    });
    console.log(JSON.stringify(this.products));
  }

}
