import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ProductActionTypes, ProductActions      } from './products.actions';
import { Product } from '../model/product';

export interface State extends EntityState<Product> {

}

export const adapter: EntityAdapter<Product> = createEntityAdapter<Product>();

//Store initial state
export const initialState: State = adapter.getInitialState({

});

//Function for handling all actions
export function reducer(state: State = initialState, action: ProductActions) : State {
      switch(action.type) {

            //Replace store with given listc
            case ProductActionTypes.SET_PRODUCTS: {
                  return adapter.addAll(action.payload.products, state);
            }                  

            //Add given product to store
            case ProductActionTypes.CREATE_PRODUCT: {
                  return adapter.addOne(action.payload.product, state);
            }
                  

            //Replace product in store with given one
            case ProductActionTypes.UPDATE_PRODUCT: {
                  return adapter.updateOne(action.payload.product, state);         
            }
                  
            //Delete product in store by id
            case ProductActionTypes.DELETE_PRODUCT: {
                  return adapter.removeOne(action.payload.id, state);
            }
                  
            //Do nothing by default
            default: {
                  return state;     
            }
                  
      }
}

// get the selectors
export const {
      selectIds,
      selectEntities,
      selectAll,
      selectTotal,
    } = adapter.getSelectors();