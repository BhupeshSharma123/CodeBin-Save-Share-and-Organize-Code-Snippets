import { Routes } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

export const routes: Routes = [
  // Public routes
  {
    path: 'login',
    loadComponent: () => import('../components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('../components/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('../pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'ai-tools-page',
    loadComponent: () => import('../pages/ai-tools-page/ai-tools-page.component').then(m => m.AIToolsPageComponent)
  },

  // Protected routes
  {
    path: 'home',
    loadComponent: () => import('../components/home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'view/:id',
    loadComponent: () => import('../components/data-view/data-view.component').then(m => m.DataViewComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'view',
    loadComponent: () => import('../components/data-view/data-view.component').then(m => m.DataViewComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('../components/code-bin/code-bin.component').then(m => m.CodeBinComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'bin',
    loadComponent: () => import('../components/code-bin/code-bin.component').then(m => m.CodeBinComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'reset-password',
    loadComponent: () => import('../pages/password-reset/password-reset.component').then(m => m.PasswordResetComponent)
  },

  // Default route
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  
  // Wildcard route for 404
  {
    path: '**',
    loadComponent: () => import('../components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
