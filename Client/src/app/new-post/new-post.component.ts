import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostService } from '../_services/post.service';
import { Post } from '../_models/post';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnDestroy {

  postForm: FormGroup;
  postSub!: Subscription;

  constructor(private fb: FormBuilder, private postService: PostService, private router: Router) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });
  }
  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }

  onSubmit() {
    if (this.postForm.valid) {
      const title = this.postForm.controls['title'].value;
      const message = this.postForm.controls['content'].value;

      this.postSub = this.postService.createPost(title, message).subscribe(() =>  this.router.navigate([""]));
    }
  }
}