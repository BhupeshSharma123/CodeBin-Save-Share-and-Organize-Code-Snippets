import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { SupabaseService } from '../../services/supabase.service';

interface SnipAI {
  id: string;
  title: string;
  code: string;
  date: Date;
}

@Component({
  selector: 'app-home',
  template: `
    <div class="max-w-7xl mx-auto">
      <!-- Hero Section -->
      <section class="text-center py-20">
        <!-- ... existing hero content ... -->
      </section>

      <!-- Recent Snippets Section -->
      <section class="py-12">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-gray-800 dark:text-white">
            Recent Snippets
          </h2>
          <a
            routerLink="/view"
            class="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
          >
            View All
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            *ngFor="let snippet of recentBins"
            class="group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden"
          >
            <div class="p-6">
              <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {{ snippet.title }}
                </h3>
                <span class="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  {{ snippet.language }}
                </span>
              </div>
              
              <div class="relative">
                <pre class="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-hidden max-h-32">{{ snippet.code }}</pre>
                <div class="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white dark:from-gray-800 to-transparent"></div>
              </div>

              <div class="mt-4 flex justify-between items-center">
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ snippet.created_at | date:'mediumDate' }}
                </span>
                <a
                  [routerLink]="['/view', snippet.id]"
                  class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                >
                  View Snippet
                  <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./home.component.css'],
  imports: [RouterLink, CommonModule, NavbarComponent],
})
export class HomeComponent implements OnInit {
  recentBins: SnipAI[] = [];

  constructor(
    private supabaseService: SupabaseService,
    public service: SharedService
  ) {}

  async ngOnInit() {
    this.service.loginOrNotLoggedIn = true;
    try {
      this.recentBins = await this.supabaseService.getUserCodeBins();
      this.recentBins = this.recentBins.slice(0, 6); // Show only 6 most recent snippets
    } catch (error) {
      console.error('Error fetching recent snippets:', error);
    }
  }
}
