import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostComponent } from './post/post.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NewPostComponent } from './new-post/new-post.component';
import { AccountComponent } from './account/account.component';

const routes: Routes = [
  { path: 'posts/new', title: 'New Post', component: NewPostComponent },
  { path: 'posts/:id', component: PostComponent },
  { path: 'account', component: AccountComponent },
  { path: '', title: "Home", component: HomeComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes,
    { onSameUrlNavigation: "reload" }
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
