import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostService } from '../_services/post.service';
import { Post } from '../_models/post';
import { Observable } from 'rxjs/internal/Observable';
import { AccountService } from '../_services/account.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy{
  postsSub: Subscription = new Subscription();
  registerClicked = false

  constructor(protected postService: PostService, protected accountService: AccountService) {
  }
  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }

  ngOnInit(): void {
    this.postsSub = this.postService.getPosts().subscribe();
  }
}