import { Component, OnInit, Inject } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {NameValidator} from '../validators/name.validator';
import {UniqueEmailValidator} from '../validators/unique.email.validator';
import { UserService, ROLES } from '@app/services';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  addUserForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(255), NameValidator()]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(255), NameValidator()]),
    email: new FormControl('', [Validators.required, Validators.email], [UniqueEmailValidator(this.userService)]),
    role: new FormControl('', [Validators.required]),
  });
  submitted = false;

  roles = ROLES;
  responseError = '';
  constructor(
    public dialogRef: MatDialogRef<AddUserComponent>,
    private userService: UserService
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  get form() {
    return this.addUserForm.controls;
  }

  onSubmit() {
    if (this.addUserForm.invalid) { return false; }
    this.submitted = true;
    this.userService.createUser(this.addUserForm.getRawValue()).subscribe((data) => {
      this.submitted = false;
      if (data.success) {
        this.dialogRef.close(data);
      } else if (data.error) {
        this.responseError = data.error;
      }
    }, (error) => {
      this.submitted = false;
    });
  }

}
