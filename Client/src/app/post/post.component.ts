import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostService } from '../_services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../_models/post';
import { Observable } from 'rxjs/internal/Observable';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { AccountService } from '../_services/account.service';
import { tap } from 'rxjs/internal/operators/tap';
import { User } from '../_models/user';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, OnDestroy {
  subs = new Array<Subscription>();
  shouldUpdate = false;
  shouldDelete = false;
  updatedPost = "";
  newComment = "";
  private id!: number;



  constructor(protected postService: PostService, private route: ActivatedRoute, protected accountService: AccountService, private router: Router) {
  }

  ngOnInit(): void {
    this.subs.push(this.route.params.subscribe(params => {
      this.id = params["id"]
      this.getPost();
    }));
  }

  ngOnDestroy(): void {
    if(this.subs){
      for(const sub of this.subs) {
        sub.unsubscribe();
      }
    }
  }

  public getPost(): void {

    if (this.id !== null) this.subs.push(this.postService.getPost(this.id).subscribe());

  }

  deletePost(id: number): void {
    this.subs.push(this.postService.deletePost(id).subscribe(() => this.router.navigate([""])));
  }

  updatePost(id: number, message: string): void {
    this.shouldUpdate = false;
     this.subs.push(this.postService.updatePost(id, message).subscribe());
  }
}
