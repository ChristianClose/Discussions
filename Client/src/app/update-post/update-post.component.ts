import { Component, OnInit } from '@angular/core';
import { PostService } from '../_services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../_models/post';
import { Observable } from 'rxjs/internal/Observable';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { AccountService } from '../_services/account.service';
import { tap } from 'rxjs/internal/operators/tap';
import { User } from '../_models/user';

@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.css']
})
export class UpdatePostComponent implements OnInit{
    post$!: Observable<Post | undefined>;
    private id = Number(this.route.snapshot.paramMap.get('id'));


  constructor(private postService: PostService, private route: ActivatedRoute, protected accountService: AccountService, private router: Router) {
  }

  ngOnInit(): void {
    this.getPost();
  }

  getPost(): void {
    this.post$ = this.postService.getPost(this.id);
  }

  updatePost(id: number): void {
    console.log(id)
    this.postService.deletePost(id).subscribe(() => this.router.navigate([""]))
  }
}
