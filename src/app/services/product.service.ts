import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, from} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Product } from '../classes/product';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productsUrl: string = 'http://localhost:4200/products/';
  private products: Product[];

  constructor(
    private http: HttpClient
  ) { }  

  /* Gets products from server and saves localy
   * @return List of all products
   */
  getProducts(): Observable<Product[]> {  
    if (this.products != null) {
      return of(this.products as Product[]);
    }

    const url = `${this.productsUrl}`;
    var response: Observable<Product[]> = this.http.get<Product[]>(url)
      .pipe(
        tap( _ => this.log(`Fetched products`)),
        catchError(this.handleError<any>(`getProducts`))
      ); 
    response.subscribe(products => this.setProducts(products));
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
    return this.http.get<Product>(url)
      .pipe(
        tap( _ => this.log(`Fetched product id=${id}`)),
        catchError(this.handleError<any>(`getProduct`))
      ); 
    
  }

  /* Sends create reques to server and creates object localy */
  createProduct(product: Product): Observable<number> {
    const url = `${this.productsUrl}`;
    var f = false;
    this.products.push(product);  
    var response: Observable<number> = this.http.post<number>(url, product)
      .pipe(
        tap( _ => {
          this.log(`Created new product ${product.name} with price of ${product.price}`);
          product.id = _;
          //f (f == false) this.products.push(product);  
          f = true;     
        }),
        catchError(this.handleError<any>(`createProduct`))
      );        
    return response;
  }

  /* Sends update request to server and updates object localy */
  updateProduct(product: Product): Observable<any> {
    const url = `${this.productsUrl}`;
    var response: Observable<any> = this.http.patch(url, product)
      .pipe(
        tap( _ => {
          this.log(`Updated product id=${product.id}`);
          this.products.forEach(el => {
            if (el.id == product.id) 
            {
                el.name = product.name;
                el.price = product.price;
            }
          });
        }),
        catchError(this.handleError<any>(`updateProduct id=${product.id}`))
      ); 
    return response;
  }

  /* Sends delete request to server and deletes object localy */
  deleteProduct(id: number): Observable<any> {
    const url = `${this.productsUrl}/${id}`;
    var response: Observable<any> = this.http.delete(url)
      .pipe(
        tap( _ => {
          this.log(`Deleted product id=${id}`);
          this.products = this.products.filter(x => x.id !== id);
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
    this.products = products;
  }

  /* Logs message */
  private log(message: string) {
    //Any logging to be implemented here
    //console.log(message);
  }

}
