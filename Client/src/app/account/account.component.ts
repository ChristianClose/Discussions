import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { Observable, Subscription, pipe } from 'rxjs';
import { User } from '../_models/user';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, OnDestroy {
  private updateSub!: Subscription;
  protected shouldUpdate = false;
  protected passwordForm!: FormGroup;
  protected passwordUpdated = false;

  constructor(protected accountService: AccountService) { }
  ngOnDestroy(): void {
    if(this.updateSub){
      this.updateSub.unsubscribe();
    }
    
  }

  ngOnInit(): void {
    this.passwordForm = new FormGroup({
      newPassword: new FormControl('', [
        Validators.required, 
        Validators.minLength(8),]),
      confirmPassword: new FormControl('', [        
        Validators.required, 
        Validators.minLength(8), ]),
    },
      { validators: [
        this.validatePassword
      ] })
  }

  validatePassword: ValidatorFn =
    (control: AbstractControl): ValidationErrors | null => {
      console.log(control.errors)
      if (control.value["newPassword"] === control.value["confirmPassword"]) {
        return null;
      } else {
        return { passwordError: "Passwords do not match" };
      }
    };

  updatePassword() {
    this.updateSub = this.accountService.Update(this.passwordForm.controls["newPassword"].value).subscribe(() => {
      this.passwordUpdated = true;
      this.passwordForm.reset();
    });
  }
}
