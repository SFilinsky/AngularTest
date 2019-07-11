import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store, State, select} from '@ngrx/store';
import { Update } from '@ngrx/entity'
import { Observable, of, from, Subscription} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ProductModule } from '../product.module';

import { Product } from '../model/product';
import * as ProductActions from "../store/products.actions";
import { ProductsState, getProducts } from '../store/meta-reducer';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productsUrl: string = 'http://localhost:4200/products/';
  private products: Product[];
  private products$: Observable<Product[]>;
  private sub: Subscription;

  constructor(
    private _http: HttpClient,
    private _store: Store<ProductsState>
  ) {
    this.products$ = _store.pipe(getProducts);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  /* Gets products from server and saves localy
   * @return List of all products
   */
  getProducts(): Observable<Product[]> {      
    var response: Observable<Product[]>;    
    if (this.products != null) {
      response = of(this.products);
      return response;
    }           
    const url = `${this.productsUrl}`;
    response = this._http.get<Product[]>(url)
      .pipe(
        tap( _ => this.log(`Fetched products`)),
        catchError(this.handleError<any>(`getProducts`))
      ); 
    var sub = response.subscribe(
      products => {        
        this.setProducts(products);   
        sub.unsubscribe();              
      }
    );  
    return response;  
  }

  /* Gets product from server or local copy */
  getProduct(id: number): Observable<Product> {
    if (this.products != null) {
      var product = this.products.find(x => x.id === id);
      if (product != null) {
        return of(product as Product);
      }
    }
    const url = `${this.productsUrl}/${id}`;
    return this._http.get<Product>(url)
      .pipe(
        tap( _ => this.log(`Fetched product id=${id}`)),
        catchError(this.handleError<any>(`getProduct`))
      ); 
    
  }

  /* Sends create reques to server and creates object localy */
  createProduct(product: Product): Observable<number> {
    const url = `${this.productsUrl}`;
    var response: Observable<number> = this._http.post<number>(url, product)
      .pipe(
        tap( _ => {
          this.log(`Created new product ${product.name} with price of ${product.price}`);
          product.id = _;          
          this._store.dispatch(new ProductActions.CreateProduct({ product }));  
        }),
        catchError(this.handleError<any>(`createProduct`))
      );        
    return response;
  }

  /* Sends update request to server and updates object localy */
  updateProduct(product: Product): Observable<any> {
    const productUpdate: Update<Product> = {
      id: product.id,
      changes: { 
        name: product.name,
        price: product.price
      }
    };
    const url = `${this.productsUrl}`;
    var response: Observable<any> = this._http.patch(url, product)
      .pipe(
        tap( _ => {
          this.log(`Updated product id=${product.id}`);
          this._store.dispatch(new ProductActions.UpdateProduct({product: productUpdate}));
        }),
        catchError(this.handleError<any>(`updateProduct id=${product.id}`))
      ); 
    return response;
  }

  /* Sends delete request to server and deletes object localy */
  deleteProduct(id: number): Observable<any> {
    const url = `${this.productsUrl}/${id}`;
    var response: Observable<any> = this._http.delete(url)
      .pipe(
        tap( _ => {
          this.log(`Deleted product id=${id}`);
          this._store.dispatch(new ProductActions.DeleteProduct({ id }));
        }),
        catchError(this.handleError<any>(`deleteProduct id=${id}`))
      );         
    return response;
  }  

  /* Handles error and returns save object 
   * @param operation - Operation description
   * @param result - Save object to return
   * @returns Save object for failed operation
   */
  private handleError<T> (operation: String = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);  
      return of(result as T);
    }    
  }

  /* Sets products */
  private setProducts(products: Product[]) {
    this._store.dispatch(new ProductActions.SetProducts({ products }));
    this.sub = this.products$.subscribe(item => this.products = item);
    this.log(`Initilized store: ${JSON.stringify(this.products)}`);
  }

  /* Logs message */
  private log(message: string) {
    //Any logging to be implemented here
    //console.log(message);
  }

}
