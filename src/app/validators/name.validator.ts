import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function NameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
      const specials = /^[\p{L}\s]*$/iu;
      if (!control.value) { return null; }

      if (control.value && specials.test(control.value)) {
        return null;
      }

      control.setErrors( { nameError: true });
      return { nameError: true };
  };
}
