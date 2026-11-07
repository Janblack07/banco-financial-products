import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  input,
  output,
  signal,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-contextual-menu',
  standalone: true,
  imports: [],
  templateUrl: './contextual-menu.html',
  styleUrl: './contextual-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContextualMenu {
  @ViewChild('trigger', { read: ElementRef })
  private triggerRef?: ElementRef<HTMLElement>;

  readonly edit = output<void>();
  readonly remove = output<void>();

  readonly ariaLabel = input('Opciones del producto');

  readonly opened = signal(false);

  readonly menuTop = signal(0);
  readonly menuLeft = signal(0);

  toggle(event: MouseEvent): void {
    event.stopPropagation();

    if (this.opened()) {
      this.close();
      return;
    }

    this.openMenu();
  }

  close(): void {
    this.opened.set(false);
  }

  onEdit(event: MouseEvent): void {
    event.stopPropagation();

    this.close();
    this.edit.emit();
  }

  onRemove(event: MouseEvent): void {
    event.stopPropagation();

    this.close();
    this.remove.emit();
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.close();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.close();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.close();
  }

  private openMenu(): void {
    const trigger = this.triggerRef?.nativeElement;

    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();

    const menuWidth = 130;
    const menuHeight = 88;
    const spacing = 4;

    const availableBelow =
      window.innerHeight - rect.bottom;

    const openUp =
      availableBelow < menuHeight + spacing;

    const top = openUp
      ? rect.top - menuHeight - spacing
      : rect.bottom + spacing;

    const idealLeft =
      rect.right - menuWidth;

    const left = Math.max(
      8,
      Math.min(
        idealLeft,
        window.innerWidth - menuWidth - 8
      )
    );

    this.menuTop.set(Math.max(8, top));
    this.menuLeft.set(left);

    this.opened.set(true);
  }
}
