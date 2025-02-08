import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component';
import { TourService } from '../services/tour.service';
import { TourOverlayComponent } from '../../components/tour-overlay/tour-overlay.component';
import { SupabaseService } from '../services/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ThemeToggleComponent,
    TourOverlayComponent,
  ],
  template: `
    <nav class="bg-gray-800">
      <div class="responsive-container">
        <div class="relative flex items-center justify-between h-16">
          <!-- Mobile menu button -->
          <div class="lg:hidden">
            <button
              (click)="toggleMenu()"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <svg
                class="h-6 w-6"
                [class.hidden]="isMenuOpen"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                class="h-6 w-6"
                [class.hidden]="!isMenuOpen"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <a routerLink="/" class="text-white text-xl font-bold">SnipAI</a>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden lg:flex lg:items-center lg:space-x-4">
            <a
              *ngFor="let item of navItems"
              [routerLink]="item.path"
              routerLinkActive="bg-gray-900"
              class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              {{ item.label }}
            </a>
          </div>

          <!-- User Menu -->
          <div class="flex items-center">
            <div class="hidden lg:block">
              <div *ngIf="isLoggedIn" class="relative ml-3">
                <button
                  (click)="toggleUserMenu()"
                  class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                >
                  <span class="sr-only">Open user menu</span>
                  <img
                    class="h-8 w-8 rounded-full"
                    [src]="userAvatar"
                    alt="User avatar"
                  />
                </button>
                <!-- Dropdown menu -->
                <div
                  *ngIf="isUserMenuOpen"
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5"
                >
                  <a
                    routerLink="/profile"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Your Profile
                  </a>
                  <a
                    routerLink="/settings"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </a>
                  <button
                    (click)="logout()"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Theme Toggle -->
          <div class="flex items-center space-x-4">
            <app-theme-toggle />

            <!-- Profile Dropdown -->
            <div class="relative">
              <button
                (click)="toggleProfileMenu()"
                class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white">
                  {{ userInitial }}
                </div>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <div *ngIf="isProfileMenuOpen" 
                   class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50">
                <a routerLink="/profile" 
                   class="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Profile
                </a>
                <a routerLink="/settings" 
                   class="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Settings
                </a>
                <div class="border-t border-gray-200 dark:border-gray-700"></div>
                <button
                  (click)="logout()"
                  class="w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>

            <!-- Tour Button -->
            <button
              (click)="startTour()"
              class="px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 flex items-center gap-2"
            >
              <svg
                class="w-4 h-4"
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
              Take Tour
            </button>
          </div>
        </div>

        <!-- Mobile Navigation Menu -->
        <div [class.hidden]="!isMenuOpen" class="lg:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1">
            <a
              *ngFor="let item of navItems"
              [routerLink]="item.path"
              routerLinkActive="bg-gray-900"
              class="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              (click)="isMenuOpen = false"
            >
              {{ item.label }}
            </a>
          </div>
          <!-- Mobile User Menu -->
          <div class="pt-4 pb-3 border-t border-gray-700">
            <div *ngIf="isLoggedIn" class="flex items-center px-5">
              <div class="flex-shrink-0">
                <img
                  class="h-10 w-10 rounded-full"
                  [src]="userAvatar"
                  alt="User avatar"
                />
              </div>
              <div class="ml-3">
                <div class="text-base font-medium text-white">
                  {{ userName }}
                </div>
                <div class="text-sm font-medium text-gray-400">
                  {{ userEmail }}
                </div>
              </div>
            </div>
            <div class="mt-3 px-2 space-y-1">
              <a
                *ngIf="!isLoggedIn"
                routerLink="/login"
                class="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                (click)="isMenuOpen = false"
              >
                Login
              </a>
              <ng-container *ngIf="isLoggedIn">
                <a
                  routerLink="/profile"
                  class="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                  (click)="isMenuOpen = false"
                >
                  Your Profile
                </a>
                <a
                  routerLink="/settings"
                  class="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                  (click)="isMenuOpen = false"
                >
                  Settings
                </a>
                <button
                  (click)="logout(); isMenuOpen = false"
                  class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                >
                  Sign out
                </button>
              </ng-container>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Add TourOverlay -->
    <app-tour-overlay *ngIf="tourService.isActiveTour()" />
  `,
})
export class NavbarComponent {
  isMenuOpen = false;
  isUserMenuOpen = false;
  isLoggedIn = false;
  userAvatar = 'assets/default-avatar.png';
  userName = 'John Doe';
  userEmail = 'john@example.com';
  isProfileMenuOpen = false;
  userInitial = 'U';

  navItems = [
    { path: '/home', label: 'Home' },
    { path: '/ai-tools-page', label: 'AI Tools' },
    { path: '/view', label: 'Snippet Storage' },
    { path: '/about', label: 'About' },
  ];

  constructor(
    public tourService: TourService,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.supabaseService.user$.subscribe(user => {
      if (user) {
        this.userInitial = user.email?.[0].toUpperCase() || 'U';
      }
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) this.isUserMenuOpen = false;
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  @HostListener('window:click', ['$event'])
  onClick(event: Event) {
    // Close user menu when clicking outside
    if (
      this.isUserMenuOpen &&
      !(event.target as Element).closest('.user-menu')
    ) {
      this.isUserMenuOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isProfileMenuOpen && !(event.target as HTMLElement).closest('.relative')) {
      this.isProfileMenuOpen = false;
    }
  }

  async logout() {
    try {
      await this.supabaseService.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  startTour() {
    this.tourService.startTour();
  }
}
