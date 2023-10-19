import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { Post } from '../_models/post';
import { BehaviorSubject, ReplaySubject, Subject, shareReplay, switchMap, tap } from 'rxjs';
import { Constants } from '../config/constants';
import { AccountService } from './account.service';
import { PostComment } from '../_models/post_comment';

@Injectable({
  providedIn: 'root'
})

export class PostService {

  baseUrl = Constants.API_ENDPOINT;
  Posts$: ReplaySubject<Post[]> = new ReplaySubject<Post[]>();
  Post$: ReplaySubject<Post> = new ReplaySubject<Post>();
  options = {};

  constructor(private http: HttpClient, private accountService: AccountService) {
    if (accountService.userValue) {
      this.options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.accountService.userValue?.token
        }),
        responseType: 'text'
      }
    }
  }

  getPosts(): Observable<Post[]> {

    return this.http.get<Post[]>(this.baseUrl + "/posts").pipe(tap({
      next: (posts: Post[]) => {
        posts.forEach((post: Post) => post.date = new Date(post.date).toLocaleString())
        this.Posts$.next(posts);
        switchMap((posts: Post[]) => posts);
        shareReplay(1);
        return posts;
      }
    }));
  }

  getPost(id: number) {

    // return this.Posts$.pipe(
    //   map((posts: Post[]) => posts.find(post => post.id == id)));
    return this.http.get<Post>(this.baseUrl + "/posts/" + id).pipe(tap({

      next: (response: Post) => {
        const postDate = this.getLocalDateTime(response.date);
        response.date = postDate;

        response.comments.forEach(comment => {
          const date = this.getLocalDateTime(comment.date);
          comment.date = new Date(date).toLocaleString()
        })

        this.Post$.next(response);

        return response
      }
    }))
  }

  createPost(title: string, message: string) {

    const data = {
      "Title": title,
      "Message": message
    }

    return this.http.post(this.baseUrl + "/posts/create", data, this.options).pipe(tap(() => this.getPosts()));
  }

  deletePost(id: number) {

    return this.http.delete(this.baseUrl + "/posts/delete?id=" + id, this.options).pipe(tap(() => this.getPosts()))
  }

  updatePost(id: number, message: string) {
    const data = {
      "Id": id,
      "Message": message
    }
    return this.http.put(this.baseUrl + "/posts/update", data, this.options);
  }

  searchPosts(title: string) {
    return this.http.get<Post[]>(this.baseUrl + "/posts/search?title=" + title).pipe(tap({
      next: (response: Post[]) => this.Posts$.next(response)
    }))
  }

  addComment(postId: number, comment: string) {
    return this.http.post<PostComment>(this.baseUrl + "/posts/" + postId + "/comment", "\"" + comment + "\"", this.options);
  }

  deleteComment(id: number) {
    return this.http.delete(this.baseUrl + "/posts/" + id + "/Comment", this.options);
  }

  updateComment(id: number, comment: string) {
    const body = "\"" + comment + "\"";
    console.log(body)
    return this.http.put(this.baseUrl + "/posts/" + id + "/Comment", body, this.options);
  }

  getLocalDateTime(dateTime: string) {
    const postDate: any = new Date(dateTime);
    const offset = postDate.getTimezoneOffset() * 60000;

    return new Date(postDate - offset).toLocaleString()
  }
}

