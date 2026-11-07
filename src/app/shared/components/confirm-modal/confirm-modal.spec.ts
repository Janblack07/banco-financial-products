import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { ConfirmModal } from './confirm-modal';

describe('ConfirmModal', () => {
  let fixture: ComponentFixture<ConfirmModal>;
  let component: ConfirmModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ConfirmModal
      ]
    }).compileComponents();

    fixture =
      TestBed.createComponent(ConfirmModal);

    component =
      fixture.componentInstance;

    fixture.componentRef.setInput(
      'title',
      'Eliminar producto'
    );

    fixture.componentRef.setInput(
      'message',
      '¿Estás seguro de eliminar este producto?'
    );

    fixture.componentRef.setInput(
      'cancelText',
      'Cancelar'
    );

    fixture.componentRef.setInput(
      'confirmText',
      'Confirmar'
    );

    fixture.componentRef.setInput(
      'loading',
      false
    );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const element =
      fixture.nativeElement as HTMLElement;

    expect(
      element.textContent
    ).toContain(
      'Eliminar producto'
    );
  });

  it('should render message', () => {
    const element =
      fixture.nativeElement as HTMLElement;

    expect(
      element.textContent
    ).toContain(
      '¿Estás seguro de eliminar este producto?'
    );
  });

  it('should render cancel text', () => {
    const element =
      fixture.nativeElement as HTMLElement;

    expect(
      element.textContent
    ).toContain(
      'Cancelar'
    );
  });

  it('should render confirm text', () => {
    const element =
      fixture.nativeElement as HTMLElement;

    expect(
      element.textContent
    ).toContain(
      'Confirmar'
    );
  });

  it('should emit cancelled event', () => {
    const emitSpy =
      vi.spyOn(
        component.cancelled,
        'emit'
      );

    component.cancelled.emit();

    expect(
      emitSpy
    ).toHaveBeenCalled();
  });

  it('should emit confirmed event', () => {
    const emitSpy =
      vi.spyOn(
        component.confirmed,
        'emit'
      );

    component.confirmed.emit();

    expect(
      emitSpy
    ).toHaveBeenCalled();
  });

  it('should reflect loading input', () => {
    fixture.componentRef.setInput(
      'loading',
      true
    );

    fixture.detectChanges();

    expect(
      component.loading()
    ).toBe(true);
  });

  it('should reflect false loading state', () => {
    fixture.componentRef.setInput(
      'loading',
      false
    );

    fixture.detectChanges();

    expect(
      component.loading()
    ).toBe(false);
  });

  it('should update title input', () => {
    fixture.componentRef.setInput(
      'title',
      'Confirmación'
    );

    fixture.detectChanges();

    expect(
      component.title()
    ).toBe(
      'Confirmación'
    );

    expect(
      fixture.nativeElement.textContent
    ).toContain(
      'Confirmación'
    );
  });

  it('should update message input', () => {
    fixture.componentRef.setInput(
      'message',
      'Nuevo mensaje'
    );

    fixture.detectChanges();

    expect(
      component.message()
    ).toBe(
      'Nuevo mensaje'
    );
  });
});
