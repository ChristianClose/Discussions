import { Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { PostService } from '../_services/post.service';
import { PostComponent } from '../post/post.component';
import { Observable, Subscription, timeout } from 'rxjs';
import { AccountService } from '../_services/account.service';
import { Post } from '../_models/post';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, OnDestroy {
  subs = new Array<Subscription>;
  newComment = "";
  post$!: Observable<Post | undefined>;
  postId!: number;
  shouldDelete = false;
  shouldUpdate = false;
  deleteConfirmations: Array<boolean> = new Array<boolean>();
  updateConfirmations: Array<boolean> = new Array<boolean>();

  constructor(protected postService: PostService, protected accountService: AccountService, private route: ActivatedRoute, private router: Router) { }

  ngOnDestroy(): void {
    for (const sub of this.subs) {
      sub.unsubscribe();
    }
  }
  ;

  ngOnInit(): void {
    this.subs.push(this.route.params.subscribe(params => {
      this.postId = params["id"]
    }));
  }

  addComment(id: number, comment: string): void {
    this.subs.push(this.postService.addComment(this.postId, comment).subscribe(() => {
      this.postService.getPost(this.postId);
      this.reloadPostComponent();
    }));
    this.newComment = "";

  }

  deleteComment(id: number): void {
    this.subs.push(this.postService.deleteComment(id).subscribe(() => this.reloadPostComponent()));
  }

  updateComment(id: number, comment: string): void {
    this.subs.push(this.postService.updateComment(id, comment).subscribe(() => this.reloadPostComponent()));
  }

  reloadPostComponent() {
    this.router.navigateByUrl('', { skipLocationChange: true }).then(() => {
      this.router.navigate(["/posts/" + this.postId]);
    });
  }

}