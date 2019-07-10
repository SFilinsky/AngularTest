import { Action, on } from '@ngrx/store';
import { ProductActionTypes, ProductActions      } from './products.actions';
import { Product } from '../model/product';


//Default value
let initialState: Product[] = [];

//Function for handling all actions
export function reducer(state: Product[] = initialState, action: ProductActions) {
      var newState: Product[];
      const body = action.payload;
      switch(action.type) {
            //Replace vault with given list
            case ProductActionTypes.SET_PRODUCTS:
                  return newState = body;
            //Add given product to vault
            case ProductActionTypes.CREATE_PRODUCT:
                  return newState = [...state, body];
            //Replace product in vault with given one
            case ProductActionTypes.UPDATE_PRODUCT:
                  return newState = state.map( 
                              el => (el.id == body.id) ? body : el
                        );            
            //Delete product in vault by id
            case ProductActionTypes.DELETE_PRODUCT:
                  return newState = state.filter( el => el.id != body);
            //Do nothing by default
            default:
                  return state;     
      }
}