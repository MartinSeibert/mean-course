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
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPostUpdateListener() {
    // returns a reference to the Subject that can only be observed, not modified
    return this.postsUpdated.asObservable();
  }

  // maps every post from the api to a Post object that has id instead of _id
  getPosts(postsPerPage: number, currentPage: number) {
    // back ticks allow you to dynamically add elements into a string
    // called Dynamic Value Injection
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; totalPosts: number }>(
        'http://localhost:3000/api/posts' + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath
              };
            }),
            totalPosts: postData.totalPosts
          };
        })
      )
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.totalPosts
        });
      });
  }

  getPost(id: string) {
    // return an observable
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
    }>('http://localhost:3000/api/posts/' + id);
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
        // user is routed back to the post list after they add a post
        this.router.navigate(['/']);
      });
  }

  // can take in an image file or a file path on the server
  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    // can't check File explicitly here, but File will be an object and string will not
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = { id, title, content, imagePath: image };
    }

    this.http
      .put('http://localhost:3000/api/posts/' + id, postData)
      .subscribe(response => {
        // user is routed back to the post list after they add a post
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    // by returning the http call, you can subscribe from the component
    return this.http.delete('http://localhost:3000/api/posts/' + postId);
  }
}
