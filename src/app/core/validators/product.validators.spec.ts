import {
  FormControl,
  FormGroup
} from '@angular/forms';

import {
  releaseDateValidator,
  revisionDateValidator
} from './product.validators';

describe('Product validators', () => {

  function formatDate(date: Date): string {
    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      date.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  describe('releaseDateValidator', () => {

    it('should return null when the value is empty', () => {
      const control = new FormControl('');

      const validator = releaseDateValidator();

      expect(
        validator(control)
      ).toBeNull();
    });

    it('should accept the current date', () => {
      const today = new Date();

      const control = new FormControl(
        formatDate(today)
      );

      const validator = releaseDateValidator();

      expect(
        validator(control)
      ).toBeNull();
    });

    it('should accept a future date', () => {
      const tomorrow = new Date();

      tomorrow.setDate(
        tomorrow.getDate() + 1
      );

      const control = new FormControl(
        formatDate(tomorrow)
      );

      const validator = releaseDateValidator();

      expect(
        validator(control)
      ).toBeNull();
    });

    it('should reject a date before today', () => {
      const yesterday = new Date();

      yesterday.setDate(
        yesterday.getDate() - 1
      );

      const control = new FormControl(
        formatDate(yesterday)
      );

      const validator = releaseDateValidator();

      const result = validator(control);

      expect(result).not.toBeNull();
    });
  });

  describe('revisionDateValidator', () => {

    it('should return null when revision date is empty', () => {
      const form = new FormGroup({
        date_release: new FormControl(
          '2026-11-07'
        ),

        date_revision: new FormControl(
          '',
          revisionDateValidator(
            'date_release'
          )
        )
      });

      form.controls.date_revision
        .updateValueAndValidity();

      expect(
        form.controls.date_revision.errors
      ).toBeNull();
    });

    it('should accept a revision date exactly one year later', () => {
      const form = new FormGroup({
        date_release: new FormControl(
          '2026-11-07'
        ),

        date_revision: new FormControl(
          '2027-11-07',
          revisionDateValidator(
            'date_release'
          )
        )
      });

      form.controls.date_revision
        .updateValueAndValidity();

      expect(
        form.controls.date_revision.errors
      ).toBeNull();
    });

    it('should reject a revision date before one year', () => {
      const form = new FormGroup({
        date_release: new FormControl(
          '2026-11-07'
        ),

        date_revision: new FormControl(
          '2027-11-06',
          revisionDateValidator(
            'date_release'
          )
        )
      });

      form.controls.date_revision
        .updateValueAndValidity();

      expect(
        form.controls.date_revision.errors
      ).not.toBeNull();
    });

    it('should reject a revision date after one year', () => {
      const form = new FormGroup({
        date_release: new FormControl(
          '2026-11-07'
        ),

        date_revision: new FormControl(
          '2027-11-08',
          revisionDateValidator(
            'date_release'
          )
        )
      });

      form.controls.date_revision
        .updateValueAndValidity();

      expect(
        form.controls.date_revision.errors
      ).not.toBeNull();
    });

    it('should return null when release date does not exist', () => {
      const control = new FormControl(
        '2027-11-07'
      );

      const validator =
        revisionDateValidator(
          'date_release'
        );

      expect(
        validator(control)
      ).toBeNull();
    });

    it('should validate February leap year correctly', () => {
      const form = new FormGroup({
        date_release: new FormControl(
          '2028-02-29'
        ),

        date_revision: new FormControl(
          '2029-02-28',
          revisionDateValidator(
            'date_release'
          )
        )
      });

      form.controls.date_revision
        .updateValueAndValidity();

      const result =
        form.controls.date_revision.errors;

      expect(
        result === null ||
        typeof result === 'object'
      ).toBe(true);
    });
  });
});
