import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  private mode = 'create';
  private postId: string;
  public post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  // it is best practice to keep constructors lean and to put initialization code in ngOnInit
  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),

      content: new FormControl(null, { validators: [Validators.required] }),
      // angular differentiates between synchronous validators and asynchronous validators
      image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
    });

    // parameter map is a built in observer, so you never need to unsubscribe
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');

        // want to show a spinner while loading posts
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content
          });
          this.isLoading = false;
        });
      } else {
        this.mode = 'create';
        this.postId = null;
        this.post = null;
      }
    });
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(this.form.value.title, this.form.value.content);
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content
      );
    }
    this.form.reset();
  }

  onImagePicked(event: Event) {
    // cast the event target as an HTMLInputElement to access the files
    const file = (event.target as HTMLInputElement).files[0];
    // change just the value of the form's image
    this.form.patchValue({ image: file });
    // let angular know that the image has been updated
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);


  }
}
