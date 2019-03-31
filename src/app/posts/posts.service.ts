import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

// Angular decorator that allows for this class to be selected for dependency injection
// the providedIn root parameter ensures that angular only creates one instance of this class
@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];

  // defines a new subject to be used as an observable
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: Post[] }>(
        'http://localhost:3000/api/posts'
      )
      .subscribe(postData => {
        this.posts = postData.posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title, content };

    this.http
      .post<{ message: string }>('http://localhost:3000/api/posts', post)
      .subscribe(responseData => {
        console.log(responseData.message);
        this.posts.push(post);
        // emits an observable has changed event for observers of postsUpdated to react to
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    // returns a reference to the Subject that can only be observed, not modified
    return this.postsUpdated.asObservable();
  }
}
