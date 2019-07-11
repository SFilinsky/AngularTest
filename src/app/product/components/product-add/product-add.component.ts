import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';

import { Product } from '../../model/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css', '../../../../global-styles/forms-style.css']
})
export class ProductAddComponent implements OnInit {

  model = new Product();

  constructor(
    private location: Location,
    private productService: ProductService 
  ) { }

  ngOnInit() {
  }

  /* Subscribes form */
  createProduct(form: NgForm): void {
    if (form.valid)
      var sub = this.productService.createProduct(this.model)
        .subscribe(() => {
          this.goBack();
        });
  }

  /* Goes to previous page */
  goBack(): void {
    this.location.back();
  }

}
