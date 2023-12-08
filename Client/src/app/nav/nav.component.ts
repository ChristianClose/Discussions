import { Component, EventEmitter, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Constants } from "../config/constants";
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { AccountService } from "../_services/account.service";
import { first } from "rxjs/internal/operators/first";
import { User } from "../_models/user";
import { map } from "rxjs/internal/operators/map";
import { PostService } from "../_services/post.service";
import { Post } from "../_models/post";
import { tap } from "rxjs/internal/operators/tap";
import { Observable, Subscription, switchMap } from "rxjs";
import { Router } from "@angular/router";


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})


export class NavComponent implements OnInit, OnDestroy {
  title = Constants.SITE_TITLE;
  form!: FormGroup;
  loading = false;
  submitted = false;
  loginError!: string;
  search$!: Observable<Post[]> | null;
  subs: Array<Subscription> = new Array<Subscription>;

  constructor(private formBuilder: FormBuilder, protected accountService: AccountService, protected postService: PostService, private router: Router) { }

  get controls() { return this.form.controls };

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required]
    });
  }

  ngOnDestroy(): void {
    for (const sub of this.subs) {
      console.log("Unsubscribed")
      sub.unsubscribe();
    }
  }

  Login() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }
    
    this.loading = true;
    this.subs.push(this.accountService.Login(this.controls['username'].value, this.controls['password'].value)
      .subscribe({
        next: () => {
          this.form.reset();
          this.form.updateValueAndValidity();
          this.submitted = false;
        },
        error: error => this.loginError = error.error
      }))



  }

  Logout() {
    this.accountService.Logout();
    this.reloadComponent();
  }

  Search(event: any) {

    let value = event.target.value;
    if (value) {
      this.search$ = this.postService.searchPosts(value);
      this.subs.push(this.search$.subscribe(items => items.length == 0 ? this.search$ = null : items));
    } else {
      this.search$ = null;
      this.subs.push(this.postService.getPosts().subscribe());
    }

    setTimeout(() => this.Unsubscribe(), 15);
  }

  async Unsubscribe() {
    if (this.subs) {
      for (let i = 0; i < this.subs.length; i++) {
        this.subs[i].unsubscribe()

        if (this.subs[i].closed) {
          this.subs.splice(i, 1);
        }
      }
    }
  }

  reloadComponent() {
    const currentUrl = this.router.url
    this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}


