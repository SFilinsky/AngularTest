import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';

import { Product } from '../../model/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css', '../../../../global-styles/forms-style.css']
})
export class ProductEditComponent implements OnInit {

  model: Product;

  buttonLock = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private productService: ProductService 
  ) { }

  ngOnInit() {
    const id = +this.route.snapshot.paramMap.get('id');
    var sub = this.productService.getProduct(id)
      .subscribe(
        product => {
          this.getProduct(product);
          sub.unsubscribe();
        },
        err => {
          this.goMain();
          sub.unsubscribe();
        }
      );    
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
