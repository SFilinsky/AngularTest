import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';

import { Product } from '../../model/product';
import { ProductService } from '../../services/product.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css', '../../../../global-styles/forms-style.css']
})
export class ProductEditComponent implements OnInit, OnDestroy {

  model: Product;

  buttonLock = true;  
  ngUnsubscribe = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private productService: ProductService 
  ) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    var sub = this.productService.getProduct(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        product => {
          this.getProduct(product);
        },
        err => {
          this.goMain();
        }
      );    
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /* Gets current product */
  getProduct(product: Product) {
    if (product == null) this.goMain();
    this.model = product;
    this.buttonLock = false;  
  }
  
  
  /* Subscribes form */
  saveProduct(form: NgForm) {    
    if (form.valid && this.buttonLock == false)
    {
      this.buttonLock = true;
      var sub = this.productService.updateProduct(this.model)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(() => { 
          this.goBack();
          sub.unsubscribe();
        });
    }
  }

  /* Deletes current product */
  deleteProduct() {
    if (this.buttonLock == false) 
    {
      this.buttonLock = true;
      var sub = this.productService.deleteProduct(this.model.id)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(() => {
          this.goBack();            
          sub.unsubscribe();       
        });
    }
  }

  
  /* Goes to previous page */
  goBack() {
    this.location.back();
  }

  
  /* Goes to starting page */
  goMain() {
    this.router.navigateByUrl("");
  }

}
