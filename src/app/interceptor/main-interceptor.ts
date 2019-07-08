import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse} from '@angular/common/http';
import { delay, mergeMap, materialize, dematerialize, findIndex } from 'rxjs/operators';
import { Product } from '../classes/product';


const storageKey: string = 'products';
let productList: Product[] = JSON.parse(localStorage.getItem(storageKey)) || [];


/* Interceptor to imitate backend */
@Injectable()
export class MainInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const {url, method, headers, body } = req;  

        //Mocking
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize())
            .pipe(delay(100))
            .pipe(dematerialize());

        //Filters Requests
        function handleRoute() {            
            switch (true) {
                case url.endsWith('/products/') && method === 'POST':
                    return createProduct();
                case url.endsWith('/products/') && method === 'GET':
                    return getProducts();
                case url.match(/\/products\/\/\d+$/) && method === 'GET':
                    return getProductById();
                case url.endsWith('/products/') && method === 'PATCH':
                    return updateProduct();
                case url.match(/\/products\/\/\d+$/) && method === 'DELETE':
                    return deleteProduct();
                default:
                // pass through any requests not handled above
                return next.handle(req);
            }
        }
        

        //Route functions

        /* Creates new product */
        function createProduct() {  
            const product: Product = body;
            product.id = productList.length ?
                Math.max(...productList.map(x => (x.id != null) ? x.id : 0 )) + 1 : 1;            
            productList.push(product);          
            localStorage.setItem(storageKey, JSON.stringify(productList));
            return ok(product.id);
        }

        /* Returns list of products */
        function getProducts() {
            return ok(productList);
        }

        
        /* Returns product by id */
        function getProductById() {
            return ok(productList.find(x => x.id === idFromUrl()));
        }

        /* Updates product */
        function updateProduct() {                    
            const product = body;
            if (productList.findIndex(x => x.id == product.id) == null)
                return error('Wrong product index');

            productList.forEach(el => {
                if (el.id == product.id) 
                {
                    el.name = product.name;
                    el.price = product.price;
                }
            });
 
            localStorage.setItem(storageKey, JSON.stringify(productList));
            return ok();
        }

        /* Deletes product */
        function deleteProduct() {
            productList = productList.filter(x => x.id !== idFromUrl());
            localStorage.setItem(storageKey, JSON.stringify(productList));
            return ok();
        }


        //Additional functions
        
        /* Throws status 200 (with an object) to client */
        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        /* Throws error to client */
        function error(message) {
            return throwError({ error: { message } });
        }

        /* Gets id from url */
        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }

    }
}
