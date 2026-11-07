import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ProductService } from './product.service';
import { FinancialProduct } from '../models/financial-product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:3002/bp/products';

  const mockProduct: FinancialProduct = {
    id: 'visa-gold',
    name: 'Tarjeta Visa Gold',
    description: 'Tarjeta de crédito Visa Gold',
    logo: 'https://example.com/visa.png',
    date_release: '2026-11-07',
    date_revision: '2027-11-07'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all products', () => {
    const mockResponse = {
      data: [mockProduct]
    };

    service.getProducts().subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(response.data.length).toBe(1);
      expect(response.data[0].id).toBe('visa-gold');
    });

    const req = httpMock.expectOne(baseUrl);

    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should create a product', () => {
    service.createProduct(mockProduct).subscribe(response => {
      expect(response).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(baseUrl);

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProduct);

    req.flush(mockProduct);
  });

  it('should update a product', () => {
    const payload = {
      name: 'Tarjeta Visa Gold Premium',
      description: 'Tarjeta de crédito Visa Gold Premium',
      logo: 'https://example.com/visa-premium.png',
      date_release: '2026-11-07',
      date_revision: '2027-11-07'
    };

    const updatedProduct: FinancialProduct = {
      id: mockProduct.id,
      ...payload
    };

    service
      .updateProduct(mockProduct.id, payload)
      .subscribe(response => {
        expect(response).toEqual(updatedProduct);
      });

    const req = httpMock.expectOne(
      `${baseUrl}/${mockProduct.id}`
    );

    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);

    req.flush(updatedProduct);
  });

  it('should delete a product', () => {
    service
      .deleteProduct(mockProduct.id)
      .subscribe(response => {
        expect(response).toBeTruthy();
      });

    const req = httpMock.expectOne(
      `${baseUrl}/${mockProduct.id}`
    );

    expect(req.request.method).toBe('DELETE');

    req.flush({
      message: 'Product successfully removed'
    });
  });

  it('should verify when an id exists', () => {
    service
      .verifyId(mockProduct.id)
      .subscribe(exists => {
        expect(exists).toBe(true);
      });

    const req = httpMock.expectOne(
      `${baseUrl}/verification/${mockProduct.id}`
    );

    expect(req.request.method).toBe('GET');

    req.flush(true);
  });

  it('should verify when an id does not exist', () => {
    const id = 'new-prod';

    service
      .verifyId(id)
      .subscribe(exists => {
        expect(exists).toBe(false);
      });

    const req = httpMock.expectOne(
      `${baseUrl}/verification/${id}`
    );

    expect(req.request.method).toBe('GET');

    req.flush(false);
  });

  it('should propagate an error when getProducts fails', () => {
    service.getProducts().subscribe({
      next: () => {
        throw new Error(
          'The request should have failed'
        );
      },
      error: error => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne(baseUrl);

    req.flush(
      {
        message: 'Internal server error'
      },
      {
        status: 500,
        statusText: 'Internal Server Error'
      }
    );
  });

  it('should propagate an error when creating a product fails', () => {
    service.createProduct(mockProduct).subscribe({
      next: () => {
        throw new Error(
          'The request should have failed'
        );
      },
      error: error => {
        expect(error.status).toBe(400);
      }
    });

    const req = httpMock.expectOne(baseUrl);

    req.flush(
      {
        message: 'Invalid product'
      },
      {
        status: 400,
        statusText: 'Bad Request'
      }
    );
  });

  it('should propagate an error when updating a product fails', () => {
    const payload = {
      name: 'Tarjeta modificada',
      description: 'Descripción modificada correctamente',
      logo: 'https://example.com/logo.png',
      date_release: '2026-11-07',
      date_revision: '2027-11-07'
    };

    service
      .updateProduct(mockProduct.id, payload)
      .subscribe({
        next: () => {
          throw new Error(
            'The request should have failed'
          );
        },
        error: error => {
          expect(error.status).toBe(404);
        }
      });

    const req = httpMock.expectOne(
      `${baseUrl}/${mockProduct.id}`
    );

    req.flush(
      {
        message: 'Product not found'
      },
      {
        status: 404,
        statusText: 'Not Found'
      }
    );
  });

  it('should propagate an error when deleting a product fails', () => {
    service
      .deleteProduct(mockProduct.id)
      .subscribe({
        next: () => {
          throw new Error(
            'The request should have failed'
          );
        },
        error: error => {
          expect(error.status).toBe(404);
        }
      });

    const req = httpMock.expectOne(
      `${baseUrl}/${mockProduct.id}`
    );

    req.flush(
      {
        message: 'Product not found'
      },
      {
        status: 404,
        statusText: 'Not Found'
      }
    );
  });
});
