import { Action, props } from '@ngrx/store';
import { Product } from '../model/product';

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
      constructor(readonly payload: Product[]) { }
};
export class CreateProduct implements Action {
      readonly type = ProductActionTypes.CREATE_PRODUCT;
      constructor(readonly payload:  Product) { }
};
export class UpdateProduct implements Action {
      readonly type = ProductActionTypes.UPDATE_PRODUCT;
      constructor(readonly payload: Product) { }
};
export class DeleteProduct implements Action {
      readonly type = ProductActionTypes.DELETE_PRODUCT;
      constructor(readonly payload: number) { }
};

//Action to add any payload, does nothing
class AnyPayloadAdder implements Action {
      readonly type = null;
      constructor(readonly payload: any) { }
};

//Type including all action classes
export type ProductActions = SetProducts  | CreateProduct | UpdateProduct | DeleteProduct | AnyPayloadAdder;