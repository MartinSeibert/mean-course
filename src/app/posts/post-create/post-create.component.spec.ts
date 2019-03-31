import { TestBed, async } from '@angular/core/testing';
import { PostCreateComponent } from './post-create.component';

describe('PostCreateComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PostCreateComponent]
    }).compileComponents();
  }));

  it('should be created', () => {
    const fixture = TestBed.createComponent(PostCreateComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have a blank new post on initialization', () => {
    const fixture = TestBed.createComponent(PostCreateComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.componentInstance;
    expect(compiled.newPost).toBe('');
  });
});
