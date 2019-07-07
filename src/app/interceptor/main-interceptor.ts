import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse} from '@angular/common/http';
import { delay, mergeMap, materialize, dematerialize, findIndex } from 'rxjs/operators';
import { Product } from '../classes/product';


const storageKey: string = 'products';
let productList = JSON.parse(localStorage.getItem(storageKey)) || [];

@Injectable()
export class MainInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const {url, method, headers, body } = req;  
        //console.log(`Current vault state: ${JSON.stringify(productList)}`);      
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(100))
            .pipe(dematerialize());

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
        
        //route functions

        function createProduct() {
            const product: Product = body;
            product.id = productList.length ?
                Math.max(...productList.map(x => (x.id != null) ? x.id : 0 )) + 1 : 1;
            //productList.push(product);            
            localStorage.setItem(storageKey, JSON.stringify(productList));
            return ok(product.id);
        }

        function getProducts() {
            return ok(productList);
        }

        function getProductById() {
            return ok(productList.find(x => x.id === idFromUrl()));
        }

        function updateProduct() {                    
            const product = body;
            if (productList.findIndex(x => x.id == product.id) == null)
                return error('Wrong product index');

            productList.forEach(el => {
                console.log(JSON.stringify(el));
                if (el.id == product.id) 
                {
                    el.name = product.name;
                    el.price = product.price;
                }
            });
 
            localStorage.setItem(storageKey, JSON.stringify(productList));
            return ok();
        }

        function deleteProduct() {
            productList = productList.filter(x => x.id !== idFromUrl());
            localStorage.setItem(storageKey, JSON.stringify(productList));
            return ok();
        }


        //addiional functions
        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }

    }
}
