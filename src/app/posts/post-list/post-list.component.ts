import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 10;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];

  private postsSub: Subscription;
  // relies on angulars' dependency injection to meet the postsService need
  // due to the public keyword, the service can be referenced by this.postsService
  constructor(public postsService: PostsService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.postsService.getPosts();
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
        this.isLoading = false;
      });
  }

  onDelete(postId: string): void {
    this.postsService.deletePost(postId);
  }

  onChangedPage(pageData: PageEvent) {
    console.log(pageData);
  }

  ngOnDestroy(): void {
    // prevents the subscription from sticking around after the component has been destroyed
    this.postsSub.unsubscribe();
  }
}
