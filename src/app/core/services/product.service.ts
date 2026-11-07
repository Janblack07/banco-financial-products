import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  FinancialProduct,
  ProductResponse,
  ProductsResponse
} from '../models/financial-product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = 'http://localhost:3002/bp/products';

  getProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(this.baseUrl);
  }

  getProductById(id: string): Observable<FinancialProduct> {
    return this.http.get<FinancialProduct>(
      `${this.baseUrl}/${encodeURIComponent(id)}`
    );
  }

  verifyId(id: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.baseUrl}/verification/${encodeURIComponent(id)}`
    );
  }

  createProduct(
    product: FinancialProduct
  ): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(
      this.baseUrl,
      product
    );
  }

  updateProduct(
    id: string,
    product: Omit<FinancialProduct, 'id'>
  ): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(
      `${this.baseUrl}/${encodeURIComponent(id)}`,
      product
    );
  }

  deleteProduct(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/${encodeURIComponent(id)}`
    );
  }
}
