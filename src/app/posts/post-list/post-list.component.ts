import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];

  private postsSub: Subscription;
  // relies on angulars' dependency injection to meet the postsService need
  // due to the public keyword, the service can be referenced by this.postsService
  constructor(public postsService: PostsService) {}

  ngOnInit(): void {
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe(posts => (this.posts = posts));
  }

  ngOnDestroy(): void {
    // prevents the subscription from sticking around after the component has been destroyed
    this.postsSub.unsubscribe();
  }
}
