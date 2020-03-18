import {Observable} from 'rxjs/internal/Observable';
import {AbstractControl, AsyncValidatorFn, ValidationErrors} from '@angular/forms';
import {catchError, map} from 'rxjs/operators';
import { UserService } from '@app/services';

export function UniqueEmailValidator(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return userService.isEmailAvailable(control.value).pipe(
      map(_id => (_id ? { uniqueEmail: true } : null)),
      catchError(() => null)
    );
  };
}

export function UniqueEditEmailValidator(userService: UserService, id: string): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return userService.isEmailAvailable(control.value).pipe(
      map(_id => (!_id || (_id && _id === id ) ? null : { uniqueEmail: true })),
      catchError(() => null)
    );
  };
}
