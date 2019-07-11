import { MetaReducer, ActionReducer, select } from '@ngrx/store';
import { EntityState } from '@ngrx/entity';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import * as productEntity from './products.reducer';
import { Product } from '../model/product';

export interface Products {
  products: EntityState<Product>;
}

export interface ProductsState extends Products {}

export function debug(reducer: ActionReducer<ProductsState>): ActionReducer<ProductsState> {
      return function(state, action) {
        console.log('state', state);
        console.log('action', action);
     
        return reducer(state, action);
      };
    }

export const metaReducers: MetaReducer<any>[] = !environment.production ? [debug] : [];

export const getProducts = state$ => state$.pipe(
      select('products'),
      map(productEntity.selectAll)
)