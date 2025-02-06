import { Routes } from '@angular/router';
import { LoginComponent } from '../components/login/login.component';
import { SignupComponent } from '../components/signup/signup.component';
import { NotFoundComponent } from '../components/not-found/not-found.component';
import { CodeBinComponent } from '../components/code-bin/code-bin.component';
import { DataViewComponent } from '../components/data-view/data-view.component';
import { HomeComponent } from '../components/home/home.component';
import { AuthGuard } from '../auth/auth.guard';
import { AboutComponent } from '../pages/about/about.component';
import { AIToolsPageComponent } from '../pages/ai-tools-page/ai-tools-page.component';
import { PasswordResetComponent } from '../pages/password-reset/password-reset.component';

export const routes: Routes = [
  // Public routes
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'about', component: AboutComponent },
  { path: 'ai-tools-page', component: AIToolsPageComponent }, // Add this before wildcard route

  // Protected routes
  {
    path: 'home',
    component: HomeComponent,
    data: { requiresAuth: true },
  },
  {
    path: 'view/:id',
    component: DataViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'view',
    component: DataViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'edit/:id',
    component: CodeBinComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'bin',
    component: CodeBinComponent,
    canActivate: [AuthGuard],
  },

  // Default route (redirect to home)
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Wildcard route for 404 (should always be last)
  { path: '**', component: NotFoundComponent },

  {
    path: 'reset-password',
    component: PasswordResetComponent,
  },
];
