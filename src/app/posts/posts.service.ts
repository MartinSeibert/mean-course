import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

// Angular decorator that allows for this class to be selected for dependency injection
// the providedIn root parameter ensures that angular only creates one instance of this class
@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];

  // defines a new subject to be used as an observable
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPostUpdateListener() {
    // returns a reference to the Subject that can only be observed, not modified
    return this.postsUpdated.asObservable();
  }

  // maps every post from the api to a Post object that has id instead of _id
  getPosts() {
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath
            };
          });
        })
      )
      .subscribe(transformedPosts => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPost(id: string) {
    // return an observable
    return this.http.get<{ _id: string; title: string; content: string }>(
      'http://localhost:3000/api/posts/' + id
    );
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);

    // third argument is the file name
    postData.append('image', image, title);
    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe(responseData => {
        const post: Post = {
          id: responseData.post.id,
          // tslint:disable-next-line: object-literal-shorthand
          title: title,
          // tslint:disable-next-line: object-literal-shorthand
          content: content,
          imagePath: responseData.post.imagePath
        };
        console.log(responseData.message);
        post.id = responseData.post.id;
        this.posts.push(post);

        // emits an observable has changed event for observers of postsUpdated to react to
        this.postsUpdated.next([...this.posts]);

        // user is routed back to the post list after they add a post
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id, title, content, imagePath: null };
    this.http
      .put('http://localhost:3000/api/posts/' + id, post)
      .subscribe(response => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);

        // user is routed back to the post list after they add a post
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    this.http
      .delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
