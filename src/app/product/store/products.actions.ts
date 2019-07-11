import { Action, props } from '@ngrx/store';
import { Product } from '../model/product';
import { Update } from '@ngrx/entity';

//Enumeration of all action names
export enum ProductActionTypes {
      SET_PRODUCTS = "[Product Service] setProducts",
      CREATE_PRODUCT = "[Product Service] createProduct",
      UPDATE_PRODUCT = "[Product Service] updateProduct",
      DELETE_PRODUCT = "[Product Service] deleteProduct"
}

//Action classes for all actions
export class SetProducts implements Action {
      readonly type = ProductActionTypes.SET_PRODUCTS;
      constructor(readonly payload: { products:  Product[] }) { }
};
export class CreateProduct implements Action {
      readonly type = ProductActionTypes.CREATE_PRODUCT;
      constructor(readonly payload: { product:  Product }) { }
};
export class UpdateProduct implements Action {
      readonly type = ProductActionTypes.UPDATE_PRODUCT;
      constructor(readonly payload: { product:  Update<Product> }) { }
};
export class DeleteProduct implements Action {
      readonly type = ProductActionTypes.DELETE_PRODUCT;
      constructor(readonly payload: { id: number }) { }
};

//Type including all action classes
export type ProductActions =
      SetProducts
      | CreateProduct
      | UpdateProduct
      | DeleteProduct;