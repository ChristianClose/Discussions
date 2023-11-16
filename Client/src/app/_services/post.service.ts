import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { Post } from '../_models/post';
import { BehaviorSubject, ReplaySubject, Subject, shareReplay, switchMap, tap } from 'rxjs';
import { Constants } from '../config/constants';
import { AccountService } from './account.service';
import { PostComment } from '../_models/post_comment';
import { CommonHelpers } from '../helpers/common.helpers';

@Injectable({
  providedIn: 'root'
})

export class PostService {

  Posts$: ReplaySubject<Post[]> = new ReplaySubject<Post[]>();
  Post$: ReplaySubject<Post> = new ReplaySubject<Post>();

  constructor(private http: HttpClient, private accountService: AccountService) {}

  getPosts(): Observable<Post[]> {
    const API_URL = CommonHelpers.getApiUrl("posts")
    return this.http.get<Post[]>(API_URL).pipe(
      tap(posts => posts.forEach(post => {
        post.date = CommonHelpers.getLocalDateTime(post.date);
        this.Posts$.next(posts);
      })));
  }

  getPost(id: number) {
    const API_URL = CommonHelpers.getApiUrl(`posts/${id}`);
    return this.http.get<Post>(API_URL).pipe(tap({

      next: (response: Post) => {
        const postDate = CommonHelpers.getLocalDateTime(response.date);
        response.date = postDate;
        this.setCommentDateTime(response.comments);
        this.Post$.next(response);
        return response
      }
    }))
  }

  createPost(title: string, message: string) {

    const API_URL = CommonHelpers.getApiUrl(`posts/create`);
    const options = this.getOptions();

    const data = {
      "Title": title,
      "Message": message
    }

    return this.http.post(API_URL, data).pipe(tap(() => this.getPosts()));
  }

  deletePost(id: number) {
    const API_URL = CommonHelpers.getApiUrl(`posts/delete?id=${id}`);

    return this.http.delete(API_URL).pipe(tap(() => this.getPosts()))
  }

  updatePost(id: number, message: string) {

    const API_URL = CommonHelpers.getApiUrl("posts/update")
    const data = {
      "Id": id,
      "Message": message
    }
    return this.http.put(API_URL, data);
  }

  searchPosts(title: string) {
    const API_URL = CommonHelpers.getApiUrl(`posts/search?title=${title}`)
    return this.http.get<Post[]>(API_URL).pipe(tap({
      next: (response: Post[]) => this.Posts$.next(response)
    }))
  }

  addComment(postId: number, comment: string, parentCommentId: number) {
    const API_URL = CommonHelpers.getApiUrl(`posts/${postId}/comment`)
    
    const body = {
      comment: comment,
      parentCommentId: parentCommentId
    }

    return this.http.post<PostComment>(API_URL, body)
  }

  deleteComment(postId: number, commentId: number) {
    const API_URL = CommonHelpers.getApiUrl(`posts/${postId}/comment?id=${commentId}`)

    return this.http.delete(API_URL);
  }

  updateComment(postId: number, commentId: number, comment: string) {
    const API_URL = CommonHelpers.getApiUrl(`posts/${postId}/comment?id=${commentId}`)
    const body = "\"" + comment + "\"";

    return this.http.put(API_URL, body);
  }

  private setCommentDateTime(comments: PostComment[]): void {
    comments.forEach(comment => {
      comment.date = CommonHelpers.getLocalDateTime(comment.date);

      if (comment.children.length > 0) {
        this.setCommentDateTime(comment.children);
      }
    })
  }

  private getOptions() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.accountService.userValue?.token
    });

    const httpOptions : Object = {
      headers: headers,
      responseType: "text"
    }

    return httpOptions
  }

}

