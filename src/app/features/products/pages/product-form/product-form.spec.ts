import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  convertToParamMap,
  Router
} from '@angular/router';
import {
  of,
  throwError
} from 'rxjs';

import { ProductForm } from './product-form';
import { ProductService } from '../../../../core/services/product.service';
import { FinancialProduct } from '../../../../core/models/financial-product.model';

describe('ProductForm', () => {
  let fixture: ComponentFixture<ProductForm>;
  let component: ProductForm;

  let productServiceMock: {
    getProducts: ReturnType<typeof vi.fn>;
    createProduct: ReturnType<typeof vi.fn>;
    updateProduct: ReturnType<typeof vi.fn>;
    verifyId: ReturnType<typeof vi.fn>;
  };

  let routerMock: {
    navigate: ReturnType<typeof vi.fn>;
  };

  const mockProduct: FinancialProduct = {
    id: 'visa-gold',
    name: 'Tarjeta Visa Gold',
    description: 'Tarjeta de crédito Visa Gold',
    logo: 'https://example.com/visa.png',
    date_release: '2026-11-07',
    date_revision: '2027-11-07'
  };

  async function configureTest(
    routeId: string | null = null
  ): Promise<void> {
    productServiceMock = {
      getProducts: vi.fn(),
      createProduct: vi.fn(),
      updateProduct: vi.fn(),
      verifyId: vi.fn()
    };

    routerMock = {
      navigate: vi.fn().mockResolvedValue(true)
    };

    productServiceMock.getProducts.mockReturnValue(
      of({
        data: [mockProduct]
      })
    );

    productServiceMock.createProduct.mockReturnValue(
      of(mockProduct)
    );

    productServiceMock.updateProduct.mockReturnValue(
      of(mockProduct)
    );

    productServiceMock.verifyId.mockReturnValue(
      of(false)
    );

    await TestBed.configureTestingModule({
      imports: [
        ProductForm
      ],
      providers: [
        {
          provide: ProductService,
          useValue: productServiceMock
        },
        {
          provide: Router,
          useValue: routerMock
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap(
                routeId
                  ? { id: routeId }
                  : {}
              )
            }
          }
        }
      ]
    }).compileComponents();

    fixture =
      TestBed.createComponent(ProductForm);

    component =
      fixture.componentInstance;

    fixture.detectChanges();
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('create mode', () => {
    beforeEach(async () => {
      await configureTest();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should start in create mode', () => {
      expect(
        component.isEditMode()
      ).toBe(false);
    });

    it('should start with an invalid empty form', () => {
      expect(
        component.form.invalid
      ).toBe(true);

      expect(
        component.form.controls.id.hasError(
          'required'
        )
      ).toBe(true);

      expect(
        component.form.controls.name.hasError(
          'required'
        )
      ).toBe(true);

      expect(
        component.form.controls.description.hasError(
          'required'
        )
      ).toBe(true);

      expect(
        component.form.controls.logo.hasError(
          'required'
        )
      ).toBe(true);
    });

    it('should validate minimum id length', () => {
      const control =
        component.form.controls.id;

      control.setValue('ab');
      control.markAsTouched();

      expect(
        component.hasError(
          'id',
          'minlength'
        )
      ).toBe(true);
    });

    it('should validate minimum name length', () => {
      const control =
        component.form.controls.name;

      control.setValue('Visa');
      control.markAsTouched();

      expect(
        component.hasError(
          'name',
          'minlength'
        )
      ).toBe(true);
    });

    it('should validate minimum description length', () => {
      const control =
        component.form.controls.description;

      control.setValue('Corta');
      control.markAsTouched();

      expect(
        component.hasError(
          'description',
          'minlength'
        )
      ).toBe(true);
    });

    it('should return false when control has no requested error', () => {
      const control =
        component.form.controls.name;

      control.setValue(
        'Tarjeta Visa Gold'
      );

      control.markAsTouched();

      expect(
        component.hasError(
          'name',
          'required'
        )
      ).toBe(false);
    });

    it('should calculate revision date one year after release date', () => {
      component.form.controls.date_release
        .setValue('2026-11-07');

      expect(
        component.form.controls.date_revision.value
      ).toBe('2027-11-07');
    });

    it('should not calculate revision date when release date is empty', () => {
      component.form.controls.date_revision
        .setValue('');

      component.form.controls.date_release
        .setValue('');

      expect(
        component.form.controls.date_revision.value
      ).toBe('');
    });

    it('should not submit when form is invalid', () => {
      component.submit();

      expect(
        productServiceMock.createProduct
      ).not.toHaveBeenCalled();

      expect(
        component.form.controls.id.touched
      ).toBe(true);

      expect(
        component.form.controls.name.touched
      ).toBe(true);
    });

    it('should create a product when form is valid', () => {
      component.form.setValue({
        id: 'visa-gold',
        name: 'Tarjeta Visa Gold',
        description:
          'Tarjeta de crédito Visa Gold',
        logo:
          'https://example.com/visa.png',
        date_release:
          '2026-11-07',
        date_revision:
          '2027-11-07'
      });

      component.submit();

      expect(
        productServiceMock.createProduct
      ).toHaveBeenCalledWith({
        id: 'visa-gold',
        name: 'Tarjeta Visa Gold',
        description:
          'Tarjeta de crédito Visa Gold',
        logo:
          'https://example.com/visa.png',
        date_release:
          '2026-11-07',
        date_revision:
          '2027-11-07'
      });

      expect(
        component.successMessage()
      ).toBe(
        'Producto agregado correctamente.'
      );

      expect(
        component.submitting()
      ).toBe(false);

      expect(
        routerMock.navigate
      ).toHaveBeenCalledWith(
        ['/products']
      );
    });

    it('should show server error when product creation fails', () => {
      productServiceMock.createProduct
        .mockReturnValue(
          throwError(() => ({
            message:
              'Error de creación'
          }))
        );

      component.form.setValue({
        id: 'visa-gold',
        name: 'Tarjeta Visa Gold',
        description:
          'Tarjeta de crédito Visa Gold',
        logo:
          'https://example.com/visa.png',
        date_release:
          '2026-11-07',
        date_revision:
          '2027-11-07'
      });

      component.submit();

      expect(
        component.serverError()
      ).toBe(
        'Error de creación'
      );

      expect(
        component.submitting()
      ).toBe(false);

      expect(
        routerMock.navigate
      ).not.toHaveBeenCalled();
    });

    it('should use default error when create error has no message', () => {
      productServiceMock.createProduct
        .mockReturnValue(
          throwError(() => ({}))
        );

      component.form.setValue({
        id: 'new-card',
        name: 'Tarjeta Nueva',
        description:
          'Descripción válida del producto',
        logo:
          'https://example.com/logo.png',
        date_release:
          '2026-11-07',
        date_revision:
          '2027-11-07'
      });

      component.submit();

      expect(
        component.serverError()
      ).toBe(
        'No se pudo crear el producto.'
      );
    });

    it('should reset create form', () => {
      component.form.patchValue({
        id: 'visa-gold',
        name: 'Tarjeta Visa Gold',
        description:
          'Tarjeta de crédito Visa Gold',
        logo:
          'https://example.com/visa.png',
        date_release:
          '2026-11-07'
      });

      component.serverError.set(
        'Error'
      );

      component.successMessage.set(
        'Success'
      );

      component.reset();

      expect(
        component.form.getRawValue()
      ).toEqual({
        id: '',
        name: '',
        description: '',
        logo: '',
        date_release: '',
        date_revision: ''
      });

      expect(
        component.serverError()
      ).toBe('');

      expect(
        component.successMessage()
      ).toBe('');
    });

    it('should render validation errors after controls are touched', () => {
      component.form.markAllAsTouched();

      fixture.detectChanges();

      const element =
        fixture.nativeElement as HTMLElement;

      const errors =
        element.querySelectorAll(
          '.field-error'
        );

      expect(
        errors.length
      ).toBeGreaterThan(0);

      expect(
        element.textContent
      ).toContain(
        'Este campo es requerido.'
      );
    });
  });

  describe('edit mode', () => {
    beforeEach(async () => {
      await configureTest(
        'visa-gold'
      );
    });

    it('should start in edit mode when route has id', () => {
      expect(
        component.isEditMode()
      ).toBe(true);
    });

    it('should load product data for editing', () => {
      expect(
        productServiceMock.getProducts
      ).toHaveBeenCalled();

      expect(
        component.form.getRawValue()
      ).toEqual({
        id: mockProduct.id,
        name: mockProduct.name,
        description:
          mockProduct.description,
        logo: mockProduct.logo,
        date_release:
          mockProduct.date_release,
        date_revision:
          mockProduct.date_revision
      });
    });

    it('should disable id in edit mode', () => {
      expect(
        component.form.controls.id.disabled
      ).toBe(true);
    });

    it('should update a product', () => {
      component.form.patchValue({
        name:
          'Tarjeta Visa Gold Actualizada',
        description:
          'Descripción actualizada correctamente',
        logo:
          'https://example.com/new-logo.png',
        date_release:
          '2026-11-07',
        date_revision:
          '2027-11-07'
      });

      component.submit();

      expect(
        productServiceMock.updateProduct
      ).toHaveBeenCalledWith(
        'visa-gold',
        {
          name:
            'Tarjeta Visa Gold Actualizada',
          description:
            'Descripción actualizada correctamente',
          logo:
            'https://example.com/new-logo.png',
          date_release:
            '2026-11-07',
          date_revision:
            '2027-11-07'
        }
      );

      expect(
        component.successMessage()
      ).toBe(
        'Producto actualizado correctamente.'
      );

      expect(
        routerMock.navigate
      ).toHaveBeenCalledWith(
        ['/products']
      );
    });

    it('should show server error when update fails', () => {
      productServiceMock.updateProduct
        .mockReturnValue(
          throwError(() => ({
            message:
              'Error actualizando producto'
          }))
        );

      component.submit();

      expect(
        component.serverError()
      ).toBe(
        'Error actualizando producto'
      );

      expect(
        component.submitting()
      ).toBe(false);
    });

    it('should use default update error when message does not exist', () => {
      productServiceMock.updateProduct
        .mockReturnValue(
          throwError(() => ({}))
        );

      component.submit();

      expect(
        component.serverError()
      ).toBe(
        'No se pudo actualizar el producto.'
      );
    });

    it('should reload original product when reset is clicked', () => {
      component.form.patchValue({
        name: 'Nombre modificado'
      });

      component.reset();

      expect(
        productServiceMock.getProducts
      ).toHaveBeenCalledTimes(2);

      expect(
        component.form.controls.name.value
      ).toBe(
        mockProduct.name
      );
    });

    it('should show error when product does not exist', async () => {
      TestBed.resetTestingModule();

      productServiceMock = {
        getProducts: vi.fn()
          .mockReturnValue(
            of({
              data: []
            })
          ),

        createProduct: vi.fn(),

        updateProduct: vi.fn(),

        verifyId: vi.fn()
          .mockReturnValue(
            of(false)
          )
      };

      routerMock = {
        navigate:
          vi.fn()
            .mockResolvedValue(true)
      };

      await TestBed
        .configureTestingModule({
          imports: [
            ProductForm
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
            },
            {
              provide:
                ActivatedRoute,
              useValue: {
                snapshot: {
                  paramMap:
                    convertToParamMap({
                      id: 'missing'
                    })
                }
              }
            }
          ]
        })
        .compileComponents();

      const localFixture =
        TestBed.createComponent(
          ProductForm
        );

      const localComponent =
        localFixture.componentInstance;

      expect(
        localComponent.serverError()
      ).toBe(
        'No se encontró el producto solicitado.'
      );

      expect(
        localComponent.submitting()
      ).toBe(false);
    });

    it('should show error when loading product fails', async () => {
      TestBed.resetTestingModule();

      productServiceMock = {
        getProducts:
          vi.fn().mockReturnValue(
            throwError(() => ({
              message:
                'Error cargando producto'
            }))
          ),

        createProduct: vi.fn(),

        updateProduct: vi.fn(),

        verifyId:
          vi.fn().mockReturnValue(
            of(false)
          )
      };

      routerMock = {
        navigate:
          vi.fn()
            .mockResolvedValue(true)
      };

      await TestBed
        .configureTestingModule({
          imports: [
            ProductForm
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
            },
            {
              provide:
                ActivatedRoute,
              useValue: {
                snapshot: {
                  paramMap:
                    convertToParamMap({
                      id: 'visa-gold'
                    })
                }
              }
            }
          ]
        })
        .compileComponents();

      const localFixture =
        TestBed.createComponent(
          ProductForm
        );

      const localComponent =
        localFixture.componentInstance;

      expect(
        localComponent.serverError()
      ).toBe(
        'Error cargando producto'
      );

      expect(
        localComponent.submitting()
      ).toBe(false);
    });
  });
});
