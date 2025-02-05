import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { SupabaseService } from '../../app/services/supabase.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { User } from '@supabase/supabase-js';
import { ThemeService } from '../../app/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="bg-white dark:bg-gray-800 shadow-lg">
      <div class="w-full px-6">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <a
              routerLink="/home"
              class="text-gray-900 dark:text-white text-xl font-bold"
            >
              SnipAI
            </a>
            <ng-container *ngIf="isLoggedIn$ | async">
              <div class="ml-10 flex items-center space-x-4">
                <a
                  routerLink="/bin"
                  class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <svg
                    class="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  New Snip
                </a>
                <a
                  routerLink="/view"
                  class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <svg
                    class="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  My Snips
                </a>
              </div>
            </ng-container>
            <a
              routerLink="/about"
              class="flex items-center px-3 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg
                class="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              About
            </a>
          </div>
          <div class="flex items-center space-x-3">
            <button
              (click)="toggleTheme()"
              class="flex items-center px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
              [title]="
                (isDarkMode$ | async)
                  ? 'Switch to light mode'
                  : 'Switch to dark mode'
              "
            >
              <svg
                *ngIf="!(isDarkMode$ | async)"
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
              <svg
                *ngIf="isDarkMode$ | async"
                class="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </button>
            <ng-container *ngIf="!(isLoggedIn$ | async)">
              <a
                routerLink="/login"
                class="flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                <svg
                  class="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Login
              </a>
              <a
                routerLink="/signup"
                class="flex items-center px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
              >
                <svg
                  class="w-5 h-5 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                Sign Up
              </a>
            </ng-container>
            <button
              *ngIf="isLoggedIn$ | async"
              (click)="logout()"
              class="flex items-center px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
            >
              <svg
                class="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  isLoggedIn$: Observable<User | null>;
  isDarkMode$: Observable<boolean>;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private toastr: ToastrService,
    private themeService: ThemeService
  ) {
    this.isLoggedIn$ = this.supabaseService.user$;
    this.isDarkMode$ = this.themeService.isDarkMode$;
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }

  async logout() {
    try {
      await this.supabaseService.signOut();
      this.toastr.success('Logged out successfully');
      await this.router.navigate(['/login']);
    } catch (error: any) {
      this.toastr.error(error.message || 'Error logging out');
    }
  }
}
