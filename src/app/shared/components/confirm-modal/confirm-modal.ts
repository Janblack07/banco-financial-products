import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  imports: [],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmModal {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly confirmText = input('Confirmar');
  readonly cancelText = input('Cancelar');
  readonly loading = input(false);

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  confirm(): void {
    if (!this.loading()) {
      this.confirmed.emit();
    }
  }

  cancel(): void {
    if (!this.loading()) {
      this.cancelled.emit();
    }
  }
}
