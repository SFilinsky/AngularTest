import { Component, OnInit, OnDestroy } from '@angular/core';

import { Product } from '../../model/product';
import { ProductService } from '../../services/product.service';
import { Observable, from, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {

  products: Product[];
  dataSource: Observable<Product>;   
  ngUnsubscribe = new Subject();

  constructor(
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.products = null;
    var sub = this.productService.getProducts()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        products => {
          this.setProducts(products);
        }
      );    
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  
  setProducts(products: Product[]) : void {
    this.products = products;
  }

}
