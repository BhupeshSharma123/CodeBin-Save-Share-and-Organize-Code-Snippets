import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of, catchError } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { SupabaseService } from '../services/supabase.service';

// Define an interface for route data to improve type safety
interface RouteData {
  requiresAuth?: boolean; // Optional, defaults to true if not provided
}

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    // Extract route data with type safety
    const routeData = route.data as RouteData;
    const requiresAuth = routeData.requiresAuth ?? true;

    return this.supabaseService.user$.pipe(
      take(1), // Take only the latest value and complete
      map((user) => {
        // If the route requires authentication and the user is not logged in
        if (requiresAuth && !user) {
          return this.router.createUrlTree(['/login']);
        }

        // If the route forbids authenticated users (e.g., login/signup) and the user is logged in
        if (!requiresAuth && user) {
          return this.router.createUrlTree(['/home']);
        }

        // Otherwise, allow access to the route
        return true;
      }),
      catchError((error) => {
        console.error('Error checking authentication status:', error);
        // Redirect to login in case of an error
        return of(this.router.createUrlTree(['/login']));
      })
    );
  }
}
