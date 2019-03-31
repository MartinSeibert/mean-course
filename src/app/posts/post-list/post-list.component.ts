import { Component, Input, OnInit } from '@angular/core';

import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];

  // relies on angulars' dependency injection to meet the postsService need
  // due to the public keyword, the service can be referenced by this.postsService
  constructor(public postsService: PostsService) {}


  ngOnInit(): void {
    this.posts = this.postsService.getPosts();

    this.postsService.getPostUpdateListener().subscribe((posts) => this.posts = posts);
  }


}
