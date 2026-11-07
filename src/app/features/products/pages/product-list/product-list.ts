import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ProductService } from '../../../../core/services/product.service';
import { FinancialProduct } from '../../../../core/models/financial-product.model';

import { Header } from '../../../../shared/components/header/header';
import { Skeleton } from '../../../../shared/components/skeleton/skeleton';
import { ConfirmModal } from '../../../../shared/components/confirm-modal/confirm-modal';
import { ContextualMenu } from '../../../../shared/components/contextual-menu/contextual-menu';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    FormsModule,
    Header,
    Skeleton,
    ConfirmModal,
    ContextualMenu
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductList {
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  readonly products = signal<FinancialProduct[]>([]);

  readonly loading = signal(true);
  readonly deleting = signal(false);

  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  readonly searchTerm = signal('');

  readonly pageSize = signal(5);
  readonly currentPage = signal(1);

  readonly productToDelete =
    signal<FinancialProduct | null>(null);

  readonly filteredProducts = computed(() => {
    const term = this.searchTerm()
      .trim()
      .toLowerCase();

    if (!term) {
      return this.products();
    }

    return this.products().filter(product =>
      product.id
        .toLowerCase()
        .includes(term) ||

      product.name
        .toLowerCase()
        .includes(term) ||

      product.description
        .toLowerCase()
        .includes(term)
    );
  });

  readonly resultCount = computed(
    () => this.filteredProducts().length
  );

  readonly totalPages = computed(() => {
    return Math.max(
      1,
      Math.ceil(
        this.resultCount() /
        this.pageSize()
      )
    );
  });

  readonly paginatedProducts = computed(() => {
    const start =
      (this.currentPage() - 1) *
      this.pageSize();

    return this.filteredProducts().slice(
      start,
      start + this.pageSize()
    );
  });

  constructor() {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.productService
      .getProducts()
      .subscribe({
        next: response => {
          this.products.set(
            response.data ?? []
          );

          this.normalizePage();

          this.loading.set(false);
        },

        error: error => {
          this.errorMessage.set(
            error?.message ??
            'No se pudieron cargar los productos.'
          );

          this.loading.set(false);
        }
      });
  }

  goToCreate(): void {
    void this.router.navigate([
      '/products/new'
    ]);
  }

  editProduct(
    product: FinancialProduct
  ): void {
    void this.router.navigate([
      '/products',
      product.id,
      'edit'
    ]);
  }

  openDeleteModal(
    product: FinancialProduct
  ): void {
    this.productToDelete.set(product);
  }

  closeDeleteModal(): void {
    if (this.deleting()) {
      return;
    }

    this.productToDelete.set(null);
  }

  confirmDelete(): void {
    const product =
      this.productToDelete();

    if (!product || this.deleting()) {
      return;
    }

    this.deleting.set(true);

    this.errorMessage.set('');
    this.successMessage.set('');

    this.productService
      .deleteProduct(product.id)
      .subscribe({
        next: () => {
          this.products.update(products =>
            products.filter(
              item =>
                item.id !== product.id
            )
          );

          this.productToDelete.set(null);

          this.deleting.set(false);

          this.successMessage.set(
            'Producto eliminado exitosamente.'
          );

          this.normalizePage();
        },

        error: error => {
          this.errorMessage.set(
            error?.message ??
            'No se pudo eliminar el producto.'
          );

          this.deleting.set(false);
        }
      });
  }

  onSearch(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  onPageSizeChange(
    value: string
  ): void {
    const size = Number(value);

    if (
      ![5, 10, 20].includes(size)
    ) {
      return;
    }

    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  previousPage(): void {
    if (
      this.currentPage() > 1
    ) {
      this.currentPage.update(
        page => page - 1
      );
    }
  }

  nextPage(): void {
    if (
      this.currentPage() <
      this.totalPages()
    ) {
      this.currentPage.update(
        page => page + 1
      );
    }
  }

  onImageError(
    event: Event
  ): void {
    const image =
      event.target as HTMLImageElement;

    image.src =
      'https://placehold.co/40x40?text=Logo';
  }

  private normalizePage(): void {
    if (
      this.currentPage() >
      this.totalPages()
    ) {
      this.currentPage.set(
        this.totalPages()
      );
    }
  }
}
