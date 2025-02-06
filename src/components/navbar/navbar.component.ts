import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SupabaseService } from '../../app/services/supabase.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule],
  animations: [
    trigger('fadeInDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate(
          '0.2s ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
  styles: [
    `
      :host {
        display: block;
        height: 4rem;
      }
    `,
  ],
})
export class NavbarComponent {
  isUserMenuOpen = false;
  isMobileMenuOpen = false;
  isDarkMode = false;
  isScrolled = false;
  isLoggedIn$;

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.isLoggedIn$ = this.supabaseService.user$;
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('dark');
  }

  async signOut() {
    try {
      await this.supabaseService.signOut();
      this.isUserMenuOpen = false;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }
}
