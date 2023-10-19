import { Component, OnInit } from "@angular/core";
import { Constants } from "../config/constants";
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { AccountService } from "../_services/account.service";
import { first } from "rxjs/internal/operators/first";
import { User } from "../_models/user";
import { map } from "rxjs/internal/operators/map";


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  title = Constants.SITE_TITLE;
  form!: FormGroup;
  loading = false;
  submitted = false;
  loginError!: string;

  constructor(private formBuilder: FormBuilder, protected accountService: AccountService) { }

  get controls() { return this.form.controls };

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', [Validators.required]]
    },
      { validators: this.doPasswordsMatch() });
  }

  Register() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.accountService.Register(this.controls['username'].value, this.controls['password'].value).subscribe()
  }

  doPasswordsMatch(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      const pass1 = control.value.password;
      const pass2 = control.value.confirmPassword;

      if (!pass1 || !pass2) return null;

      return pass1 !== pass2 ? { PasswordsDontMatch: true } : null;
    }
  }
}
