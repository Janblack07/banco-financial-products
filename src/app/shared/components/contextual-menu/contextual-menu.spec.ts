import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { ContextualMenu } from './contextual-menu';

describe('ContextualMenu', () => {
  let fixture: ComponentFixture<ContextualMenu>;
  let component: ContextualMenu;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ContextualMenu
      ]
    }).compileComponents();

    fixture =
      TestBed.createComponent(ContextualMenu);

    component =
      fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start closed', () => {
    expect(
      component.opened()
    ).toBe(false);
  });

  it('should open menu when trigger is clicked', () => {
    const trigger =
      fixture.nativeElement.querySelector(
        '.contextual-menu__trigger'
      ) as HTMLButtonElement;

    trigger.click();

    fixture.detectChanges();

    expect(
      component.opened()
    ).toBe(true);

    expect(
      fixture.nativeElement.querySelector(
        '.contextual-menu__panel'
      )
    ).toBeTruthy();
  });

  it('should close menu when trigger is clicked twice', () => {
    const trigger =
      fixture.nativeElement.querySelector(
        '.contextual-menu__trigger'
      ) as HTMLButtonElement;

    trigger.click();
    fixture.detectChanges();

    expect(
      component.opened()
    ).toBe(true);

    trigger.click();
    fixture.detectChanges();

    expect(
      component.opened()
    ).toBe(false);
  });

  it('should close menu using close method', () => {
    component.opened.set(true);

    component.close();

    expect(
      component.opened()
    ).toBe(false);
  });

  it('should emit edit event', () => {
    const emitSpy =
      vi.spyOn(
        component.edit,
        'emit'
      );

    component.opened.set(true);

    component.onEdit(
      new MouseEvent('click')
    );

    expect(
      emitSpy
    ).toHaveBeenCalled();

    expect(
      component.opened()
    ).toBe(false);
  });

  it('should emit remove event', () => {
    const emitSpy =
      vi.spyOn(
        component.remove,
        'emit'
      );

    component.opened.set(true);

    component.onRemove(
      new MouseEvent('click')
    );

    expect(
      emitSpy
    ).toHaveBeenCalled();

    expect(
      component.opened()
    ).toBe(false);
  });

  it('should emit edit when edit option is clicked', () => {
    const emitSpy =
      vi.spyOn(
        component.edit,
        'emit'
      );

    const trigger =
      fixture.nativeElement.querySelector(
        '.contextual-menu__trigger'
      ) as HTMLButtonElement;

    trigger.click();

    fixture.detectChanges();

    const options =
      fixture.nativeElement.querySelectorAll(
        '.contextual-menu__option'
      );

    const editButton =
      options[0] as HTMLButtonElement;

    editButton.click();

    fixture.detectChanges();

    expect(
      emitSpy
    ).toHaveBeenCalled();

    expect(
      component.opened()
    ).toBe(false);
  });

  it('should emit remove when delete option is clicked', () => {
    const emitSpy =
      vi.spyOn(
        component.remove,
        'emit'
      );

    const trigger =
      fixture.nativeElement.querySelector(
        '.contextual-menu__trigger'
      ) as HTMLButtonElement;

    trigger.click();

    fixture.detectChanges();

    const options =
      fixture.nativeElement.querySelectorAll(
        '.contextual-menu__option'
      );

    const deleteButton =
      options[1] as HTMLButtonElement;

    deleteButton.click();

    fixture.detectChanges();

    expect(
      emitSpy
    ).toHaveBeenCalled();

    expect(
      component.opened()
    ).toBe(false);
  });

  it('should close when document is clicked', () => {
    component.opened.set(true);

    component.onDocumentClick();

    expect(
      component.opened()
    ).toBe(false);
  });

  it('should close when window is resized', () => {
    component.opened.set(true);

    component.onWindowResize();

    expect(
      component.opened()
    ).toBe(false);
  });

  it('should close when window is scrolled', () => {
    component.opened.set(true);

    component.onWindowScroll();

    expect(
      component.opened()
    ).toBe(false);
  });

  it('should expose custom aria label', () => {
    fixture.componentRef.setInput(
      'ariaLabel',
      'Opciones de Visa Gold'
    );

    fixture.detectChanges();

    const trigger =
      fixture.nativeElement.querySelector(
        '.contextual-menu__trigger'
      ) as HTMLButtonElement;

    expect(
      trigger.getAttribute(
        'aria-label'
      )
    ).toBe(
      'Opciones de Visa Gold'
    );
  });

  it('should position menu within viewport', () => {
    const trigger =
      fixture.nativeElement.querySelector(
        '.contextual-menu__trigger'
      ) as HTMLButtonElement;

    vi.spyOn(
      trigger,
      'getBoundingClientRect'
    ).mockReturnValue({
      x: 100,
      y: 100,
      top: 100,
      right: 128,
      bottom: 130,
      left: 100,
      width: 28,
      height: 30,
      toJSON: () => ({})
    });

    trigger.click();

    expect(
      component.opened()
    ).toBe(true);

    expect(
      component.menuTop()
    ).toBeGreaterThanOrEqual(8);

    expect(
      component.menuLeft()
    ).toBeGreaterThanOrEqual(8);
  });

  it('should open menu above trigger when there is not enough space below', () => {
    const trigger =
      fixture.nativeElement.querySelector(
        '.contextual-menu__trigger'
      ) as HTMLButtonElement;

    vi.spyOn(
      trigger,
      'getBoundingClientRect'
    ).mockReturnValue({
      x: 100,
      y: window.innerHeight - 40,
      top: window.innerHeight - 40,
      right: 128,
      bottom: window.innerHeight - 10,
      left: 100,
      width: 28,
      height: 30,
      toJSON: () => ({})
    });

    trigger.click();

    expect(
      component.opened()
    ).toBe(true);

    expect(
      component.menuTop()
    ).toBeLessThan(
      window.innerHeight - 40
    );
  });
});
