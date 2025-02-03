import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { SignupComponent } from '../components/signup/signup.component';
import { NotFoundComponent } from '../components/not-found/not-found.component';
import { CodeBinComponent } from '../components/code-bin/code-bin.component';
import { DataViewComponent } from '../components/data-view/data-view.component';
import { HomeComponent } from '../components/home/home.component';
import { AuthGuard } from '../auth/auth.guard'; // Add AuthGuard for protected routes
import { AboutComponent } from '../components/about/about.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'home',
    component: HomeComponent,
    // Protect the home route
  },
  {
    path: 'view',
    component: DataViewComponent,
    canActivate: [AuthGuard], // Protect the view route
  },
  {
    path: 'edit/:id',
    component: CodeBinComponent,
    canActivate: [AuthGuard], // Protect the edit route
  },
  {
    path: 'bin',
    component: CodeBinComponent,
    canActivate: [AuthGuard], // Protect the bin route
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Default route
  { path: '**', component: NotFoundComponent }, // Wildcard route for 404
];
