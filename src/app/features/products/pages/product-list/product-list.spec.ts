import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { Router } from '@angular/router';

import {
  of,
  throwError
} from 'rxjs';

import { ProductList } from './product-list';

import { ProductService } from '../../../../core/services/product.service';

import { FinancialProduct } from '../../../../core/models/financial-product.model';

describe('ProductList', () => {
  let fixture: ComponentFixture<ProductList>;

  let component: ProductList;

  let productServiceMock: {
    getProducts: ReturnType<typeof vi.fn>;
    deleteProduct: ReturnType<typeof vi.fn>;
  };

  let routerMock: {
    navigate: ReturnType<typeof vi.fn>;
  };

  const mockProducts: FinancialProduct[] = [
    {
      id: 'visa-gold',
      name: 'Tarjeta Visa Gold',
      description: 'Tarjeta de crédito Visa Gold',
      logo: 'https://example.com/visa.png',
      date_release: '2026-11-07',
      date_revision: '2027-11-07'
    },
    {
      id: 'mast-pltn',
      name: 'Mastercard Platinum',
      description: 'Tarjeta Mastercard Platinum',
      logo: 'https://example.com/mastercard.png',
      date_release: '2026-11-07',
      date_revision: '2027-11-07'
    },
    {
      id: 'cred-auto',
      name: 'Crédito Vehicular',
      description: 'Crédito para compra de vehículos',
      logo: 'https://example.com/car.png',
      date_release: '2026-11-07',
      date_revision: '2027-11-07'
    },
    {
      id: 'cred-home',
      name: 'Crédito Hipotecario',
      description: 'Crédito destinado a vivienda',
      logo: 'https://example.com/home.png',
      date_release: '2026-11-07',
      date_revision: '2027-11-07'
    },
    {
      id: 'debt-card',
      name: 'Tarjeta Débito Plus',
      description: 'Tarjeta débito para clientes',
      logo: 'https://example.com/debit.png',
      date_release: '2026-11-07',
      date_revision: '2027-11-07'
    },
    {
      id: 'prod-six',
      name: 'Producto Financiero Seis',
      description: 'Descripción del sexto producto financiero',
      logo: 'https://example.com/six.png',
      date_release: '2026-11-07',
      date_revision: '2027-11-07'
    }
  ];

  async function configureTest(
    products: FinancialProduct[] = mockProducts
  ): Promise<void> {
    productServiceMock = {
      getProducts: vi.fn().mockReturnValue(
        of({
          data: products
        })
      ),

      deleteProduct: vi.fn().mockReturnValue(
        of({
          message: 'Producto eliminado'
        })
      )
    };

    routerMock = {
      navigate: vi.fn().mockResolvedValue(true)
    };

    await TestBed.configureTestingModule({
      imports: [
        ProductList
      ],

      providers: [
        {
          provide: ProductService,
          useValue: productServiceMock
        },
        {
          provide: Router,
          useValue: routerMock
        }
      ]
    }).compileComponents();

    fixture =
      TestBed.createComponent(ProductList);

    component =
      fixture.componentInstance;

    fixture.detectChanges();
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('initialization', () => {
    beforeEach(async () => {
      await configureTest();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load products on initialization', () => {
      expect(
        productServiceMock.getProducts
      ).toHaveBeenCalled();

      expect(
        component.products()
      ).toEqual(mockProducts);

      expect(
        component.loading()
      ).toBe(false);
    });

    it('should expose the total number of results', () => {
      expect(
        component.resultCount()
      ).toBe(6);
    });

    it('should use page size 5 by default', () => {
      expect(
        component.pageSize()
      ).toBe(5);

      expect(
        component.paginatedProducts().length
      ).toBe(5);
    });

    it('should calculate total pages', () => {
      expect(
        component.totalPages()
      ).toBe(2);
    });
  });

  describe('search', () => {
    beforeEach(async () => {
      await configureTest();
    });

    it('should return all products when search is empty', () => {
      component.onSearch('');

      expect(
        component.filteredProducts().length
      ).toBe(6);
    });

    it('should filter products by id', () => {
      component.onSearch('visa-gold');

      expect(
        component.filteredProducts().length
      ).toBe(1);

      expect(
        component.filteredProducts()[0].id
      ).toBe('visa-gold');
    });

    it('should filter products by name', () => {
      component.onSearch('mastercard');

      expect(
        component.filteredProducts().length
      ).toBe(1);

      expect(
        component.filteredProducts()[0].name
      ).toBe('Mastercard Platinum');
    });

    it('should filter products by description', () => {
      component.onSearch('vehículos');

      expect(
        component.filteredProducts().length
      ).toBe(1);

      expect(
        component.filteredProducts()[0].id
      ).toBe('cred-auto');
    });

    it('should make search case insensitive', () => {
      component.onSearch(
        'TARJETA VISA'
      );

      expect(
        component.filteredProducts().length
      ).toBe(1);
    });

    it('should ignore spaces around search term', () => {
      component.onSearch(
        '   mastercard   '
      );

      expect(
        component.filteredProducts().length
      ).toBe(1);
    });

    it('should reset current page when searching', () => {
      component.currentPage.set(2);

      component.onSearch(
        'tarjeta'
      );

      expect(
        component.currentPage()
      ).toBe(1);
    });

    it('should return zero results when nothing matches', () => {
      component.onSearch(
        'producto inexistente'
      );

      expect(
        component.filteredProducts().length
      ).toBe(0);

      expect(
        component.resultCount()
      ).toBe(0);
    });
  });

  describe('pagination', () => {
    beforeEach(async () => {
      await configureTest();
    });

    it('should go to next page', () => {
      component.nextPage();

      expect(
        component.currentPage()
      ).toBe(2);

      expect(
        component.paginatedProducts().length
      ).toBe(1);
    });

    it('should not go beyond last page', () => {
      component.currentPage.set(2);

      component.nextPage();

      expect(
        component.currentPage()
      ).toBe(2);
    });

    it('should go to previous page', () => {
      component.currentPage.set(2);

      component.previousPage();

      expect(
        component.currentPage()
      ).toBe(1);
    });

    it('should not go before first page', () => {
      component.previousPage();

      expect(
        component.currentPage()
      ).toBe(1);
    });

    it('should change page size to 10', () => {
      component.currentPage.set(2);

      component.onPageSizeChange(
        '10'
      );

      expect(
        component.pageSize()
      ).toBe(10);

      expect(
        component.currentPage()
      ).toBe(1);

      expect(
        component.paginatedProducts().length
      ).toBe(6);
    });

    it('should change page size to 20', () => {
      component.onPageSizeChange(
        '20'
      );

      expect(
        component.pageSize()
      ).toBe(20);
    });

    it('should ignore invalid page size', () => {
      component.onPageSizeChange(
        '100'
      );

      expect(
        component.pageSize()
      ).toBe(5);
    });

    it('should always have at least one page when there are no results', () => {
      component.onSearch(
        'nothing-here'
      );

      expect(
        component.totalPages()
      ).toBe(1);
    });
  });

  describe('navigation', () => {
    beforeEach(async () => {
      await configureTest();
    });

    it('should navigate to create page', () => {
      component.goToCreate();

      expect(
        routerMock.navigate
      ).toHaveBeenCalledWith(
        ['/products/new']
      );
    });

    it('should navigate to edit page', () => {
      component.editProduct(
        mockProducts[0]
      );

      expect(
        routerMock.navigate
      ).toHaveBeenCalledWith(
        [
          '/products',
          'visa-gold',
          'edit'
        ]
      );
    });
  });

  describe('delete modal', () => {
    beforeEach(async () => {
      await configureTest();
    });

    it('should open delete modal', () => {
      component.openDeleteModal(
        mockProducts[0]
      );

      expect(
        component.productToDelete()
      ).toEqual(mockProducts[0]);
    });

    it('should close delete modal', () => {
      component.openDeleteModal(
        mockProducts[0]
      );

      component.closeDeleteModal();

      expect(
        component.productToDelete()
      ).toBeNull();
    });

    it('should not close modal while deleting', () => {
      component.openDeleteModal(
        mockProducts[0]
      );

      component.deleting.set(true);

      component.closeDeleteModal();

      expect(
        component.productToDelete()
      ).toEqual(mockProducts[0]);
    });

    it('should do nothing when no product is selected for deletion', () => {
      component.confirmDelete();

      expect(
        productServiceMock.deleteProduct
      ).not.toHaveBeenCalled();
    });

    it('should do nothing when deletion is already in progress', () => {
      component.openDeleteModal(
        mockProducts[0]
      );

      component.deleting.set(true);

      component.confirmDelete();

      expect(
        productServiceMock.deleteProduct
      ).not.toHaveBeenCalled();
    });

    it('should delete product successfully', () => {
      component.openDeleteModal(
        mockProducts[0]
      );

      component.confirmDelete();

      expect(
        productServiceMock.deleteProduct
      ).toHaveBeenCalledWith(
        'visa-gold'
      );

      expect(
        component.products().some(
          product =>
            product.id === 'visa-gold'
        )
      ).toBe(false);

      expect(
        component.productToDelete()
      ).toBeNull();

      expect(
        component.deleting()
      ).toBe(false);

      expect(
        component.successMessage()
      ).toBe(
        'Producto eliminado exitosamente.'
      );
    });

    it('should show server error when deletion fails', () => {
      productServiceMock.deleteProduct
        .mockReturnValue(
          throwError(() => ({
            message:
              'No fue posible eliminar'
          }))
        );

      component.openDeleteModal(
        mockProducts[0]
      );

      component.confirmDelete();

      expect(
        component.errorMessage()
      ).toBe(
        'No fue posible eliminar'
      );

      expect(
        component.deleting()
      ).toBe(false);
    });

    it('should use default deletion error when server has no message', () => {
      productServiceMock.deleteProduct
        .mockReturnValue(
          throwError(() => ({}))
        );

      component.openDeleteModal(
        mockProducts[0]
      );

      component.confirmDelete();

      expect(
        component.errorMessage()
      ).toBe(
        'No se pudo eliminar el producto.'
      );
    });

    it('should normalize page after deleting last item of page 2', () => {
      component.currentPage.set(2);

      component.openDeleteModal(
        mockProducts[5]
      );

      component.confirmDelete();

      expect(
        component.currentPage()
      ).toBe(1);

      expect(
        component.totalPages()
      ).toBe(1);
    });
  });

  describe('loading errors', () => {
    it('should show server error when products cannot be loaded', async () => {
      productServiceMock = {
        getProducts:
          vi.fn().mockReturnValue(
            throwError(() => ({
              message:
                'Error cargando productos'
            }))
          ),

        deleteProduct:
          vi.fn()
      };

      routerMock = {
        navigate:
          vi.fn()
            .mockResolvedValue(true)
      };

      await TestBed
        .configureTestingModule({
          imports: [
            ProductList
          ],

          providers: [
            {
              provide:
                ProductService,

              useValue:
                productServiceMock
            },

            {
              provide:
                Router,

              useValue:
                routerMock
            }
          ]
        })
        .compileComponents();

      const localFixture =
        TestBed.createComponent(
          ProductList
        );

      const localComponent =
        localFixture.componentInstance;

      expect(
        localComponent.errorMessage()
      ).toBe(
        'Error cargando productos'
      );

      expect(
        localComponent.loading()
      ).toBe(false);
    });

    it('should use default loading error when server has no message', async () => {
      productServiceMock = {
        getProducts:
          vi.fn().mockReturnValue(
            throwError(() => ({}))
          ),

        deleteProduct:
          vi.fn()
      };

      routerMock = {
        navigate:
          vi.fn()
            .mockResolvedValue(true)
      };

      await TestBed
        .configureTestingModule({
          imports: [
            ProductList
          ],

          providers: [
            {
              provide:
                ProductService,

              useValue:
                productServiceMock
            },

            {
              provide:
                Router,

              useValue:
                routerMock
            }
          ]
        })
        .compileComponents();

      const localFixture =
        TestBed.createComponent(
          ProductList
        );

      const localComponent =
        localFixture.componentInstance;

      expect(
        localComponent.errorMessage()
      ).toBe(
        'No se pudieron cargar los productos.'
      );
    });
  });

  describe('image fallback', () => {
    beforeEach(async () => {
      await configureTest();
    });

    it('should replace broken product image with placeholder', () => {
      const image =
        document.createElement('img');

      image.src =
        'https://example.com/error.png';

      component.onImageError({
        target: image
      } as unknown as Event);

      expect(
        image.src
      ).toContain(
        'placehold.co/40x40'
      );
    });
  });

  describe('template', () => {
    beforeEach(async () => {
      await configureTest();
    });

    it('should render products in the table', () => {
      fixture.detectChanges();

      const element =
        fixture.nativeElement as HTMLElement;

      expect(
        element.textContent
      ).toContain(
        'Tarjeta Visa Gold'
      );

      expect(
        element.textContent
      ).toContain(
        'Mastercard Platinum'
      );
    });

    it('should render result count', () => {
      fixture.detectChanges();

      const element =
        fixture.nativeElement as HTMLElement;

      expect(
        element.textContent
      ).toContain(
        '6 Resultados'
      );
    });

    it('should render empty state after search with no results', () => {
      component.onSearch(
        'no-existe'
      );

      fixture.detectChanges();

      const element =
        fixture.nativeElement as HTMLElement;

      expect(
        element.textContent
      ).toContain(
        'No se encontraron productos.'
      );
    });
  });
});
