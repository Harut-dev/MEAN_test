import { Component, OnInit, Inject } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NameValidator} from '@app/validators/name.validator';
import {UniqueEditEmailValidator} from '@app/validators/unique.email.validator';
import {ROLES, UserService} from '@services';
import { User } from '@models';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  editUserForm: FormGroup;
  submitted = false;
  responseError = '';
  roles = ROLES;

  constructor(
    public dialogRef: MatDialogRef<EditUserComponent>,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.editUserForm = new FormGroup({
      firstName: new FormControl(this.data.firstName,
        [Validators.required, Validators.minLength(2), Validators.maxLength(255), NameValidator()]),
      lastName: new FormControl(this.data.lastName,
        [Validators.required, Validators.minLength(2), Validators.maxLength(255), NameValidator()]),
      email: new FormControl(this.data.email,
        [Validators.required, Validators.email], [UniqueEditEmailValidator(this.userService, this.data._id)]),
      role: new FormControl(this.data.role, [Validators.required]),
    });
  }

  get form() {
    return this.editUserForm.controls;
  }

  onSubmit() {
    if (this.editUserForm.invalid) { return false; }
    this.submitted = true;
    this.userService.updateUser({... this.editUserForm.getRawValue(), _id: this.data._id}).subscribe((data) => {
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
