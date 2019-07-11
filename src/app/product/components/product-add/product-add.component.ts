import { Component, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';

import { Product } from '../../model/product';
import { ProductService } from '../../services/product.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css', '../../../../global-styles/forms-style.css']
})
export class ProductAddComponent implements OnDestroy {

  model = new Product();  
  ngUnsubscribe = new Subject();

  constructor(
    private location: Location,
    private productService: ProductService 
  ) { }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /* Subscribes form */
  createProduct(form: NgForm): void {
    if (form.valid)
      var sub = this.productService.createProduct(this.model)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(() => {
          this.goBack();
        });
  }

  /* Goes to previous page */
  goBack(): void {
    this.location.back();
  }

}
