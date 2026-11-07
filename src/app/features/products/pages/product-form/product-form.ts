import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  switchMap,
  take
} from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ProductService } from '../../../../core/services/product.service';
import { Header } from '../../../../shared/components/header/header';
import {
  releaseDateValidator,
  revisionDateValidator
} from '../../../../core/validators/product.validators';

@Component({
  selector: 'app-product-form',
  imports: [
    ReactiveFormsModule,
    Header
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductForm {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly submitting = signal(false);
  readonly serverError = signal('');
  readonly successMessage = signal('');
  readonly isEditMode = signal(false);

  private editingId = '';

  readonly form = this.fb.nonNullable.group({
    id: this.fb.nonNullable.control(
      '',
      {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10)
        ],
        asyncValidators: [
          control => this.idExistsValidator(control)
        ],
        updateOn: 'blur'
      }
    ),

    name: this.fb.nonNullable.control(
      '',
      [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)
      ]
    ),

    description: this.fb.nonNullable.control(
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200)
      ]
    ),

    logo: this.fb.nonNullable.control(
      '',
      [
        Validators.required
      ]
    ),

    date_release: this.fb.nonNullable.control(
      '',
      [
        Validators.required,
        releaseDateValidator()
      ]
    ),

    date_revision: this.fb.nonNullable.control(
      '',
      [
        Validators.required,
        revisionDateValidator('date_release')
      ]
    )
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode.set(true);
      this.editingId = id;
      this.loadProductForEdit(id);
    }

    this.form.controls.date_release.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(value => {
        if (!value) {
          return;
        }

        const releaseDate = new Date(`${value}T00:00:00`);

        const revisionDate = new Date(releaseDate);
        revisionDate.setFullYear(
          revisionDate.getFullYear() + 1
        );

        const formatted = this.toInputDate(revisionDate);

        this.form.controls.date_revision.setValue(
          formatted,
          {
            emitEvent: false
          }
        );

        this.form.controls.date_revision.updateValueAndValidity({
          emitEvent: false
        });
      });
  }

  submit(): void {
    this.serverError.set('');
    this.successMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    const value = this.form.getRawValue();

    if (this.isEditMode()) {
      const payload = {
        name: value.name,
        description: value.description,
        logo: value.logo,
        date_release: value.date_release,
        date_revision: value.date_revision
      };

      this.productService
        .updateProduct(this.editingId, payload)
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.successMessage.set(
              'Producto actualizado correctamente.'
            );

            this.submitting.set(false);

            void this.router.navigate(['/products']);
          },
          error: error => {
            this.serverError.set(
              error?.message ??
                'No se pudo actualizar el producto.'
            );

            this.submitting.set(false);
          }
        });

      return;
    }

    this.productService
      .createProduct({
        id: value.id,
        name: value.name,
        description: value.description,
        logo: value.logo,
        date_release: value.date_release,
        date_revision: value.date_revision
      })
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.successMessage.set(
            'Producto agregado correctamente.'
          );

          this.submitting.set(false);

          void this.router.navigate(['/products']);
        },
        error: error => {
          this.serverError.set(
            error?.message ??
              'No se pudo crear el producto.'
          );

          this.submitting.set(false);
        }
      });
  }

  reset(): void {
    this.serverError.set('');
    this.successMessage.set('');

    if (this.isEditMode()) {
      this.loadProductForEdit(this.editingId);
      return;
    }

    this.form.reset({
      id: '',
      name: '',
      description: '',
      logo: '',
      date_release: '',
      date_revision: ''
    });
  }

  hasError(
    controlName: keyof typeof this.form.controls,
    errorName: string
  ): boolean {
    const control = this.form.controls[controlName];

    return control.touched && control.hasError(errorName);
  }

  private loadProductForEdit(id: string): void {
    this.submitting.set(true);

    this.productService
      .getProducts()
      .pipe(
        map(response =>
          response.data.find(product => product.id === id)
        ),
        take(1)
      )
      .subscribe({
        next: product => {
          if (!product) {
            this.serverError.set(
              'No se encontró el producto solicitado.'
            );

            this.submitting.set(false);
            return;
          }

          this.form.patchValue({
            id: product.id,
            name: product.name,
            description: product.description,
            logo: product.logo,
            date_release: product.date_release,
            date_revision: product.date_revision
          });

          this.form.controls.id.disable();

          this.submitting.set(false);
        },
        error: error => {
          this.serverError.set(
            error?.message ??
              'No se pudo cargar el producto.'
          );

          this.submitting.set(false);
        }
      });
  }

  private idExistsValidator(
    control: AbstractControl
  ) {
    const value = String(control.value ?? '').trim();

    if (!value || value.length < 3) {
      return of(null);
    }

    if (this.isEditMode()) {
      return of(null);
    }

    return of(value).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(id =>
        this.productService.verifyId(id).pipe(
          map(exists =>
            exists
              ? { idExists: true }
              : null
          ),
          catchError(() => of(null))
        )
      )
    );
  }

  private toInputDate(date: Date): string {
    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
