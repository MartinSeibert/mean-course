import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// Angular decorator that allows for this class to be selected for dependency injection
// the providedIn root parameter ensures that angular only creates one instance of this class
@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];

  // defines a new subject to be used as an observable
  private postsUpdated = new Subject<Post[]>();

  getPosts() {
    // Spread operator ( [...arrayName] )creates a new array and adds all of the items from this.posts into the new array
    return [...this.posts];
  }

  addPost(title: string, content: string) {
    const post: Post = { title, content };
    this.posts.push(post);

    // emits an observable has changed event for observers of postsUpdated to react to
    this.postsUpdated.next([...this.posts]);
  }

  getPostUpdateListener() {
    // returns a reference to the Subject that can only be observed, not modified
    return this.postsUpdated.asObservable();
  }
}
