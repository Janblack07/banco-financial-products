import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

export function releaseDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const selectedDate = new Date(`${control.value}T00:00:00`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDate >= today
      ? null
      : { releaseDateInvalid: true };
  };
}

export function revisionDateValidator(
  releaseDateControlName: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const form = control.parent;

    if (!form || !control.value) {
      return null;
    }

    const releaseValue = form.get(releaseDateControlName)?.value;

    if (!releaseValue) {
      return null;
    }

    const releaseDate = new Date(`${releaseValue}T00:00:00`);
    const revisionDate = new Date(`${control.value}T00:00:00`);

    const expectedRevision = new Date(releaseDate);
    expectedRevision.setFullYear(
      expectedRevision.getFullYear() + 1
    );

    const isValid =
      revisionDate.getFullYear() === expectedRevision.getFullYear() &&
      revisionDate.getMonth() === expectedRevision.getMonth() &&
      revisionDate.getDate() === expectedRevision.getDate();

    return isValid
      ? null
      : { revisionDateInvalid: true };
  };
}
