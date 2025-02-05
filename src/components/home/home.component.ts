import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { SupabaseService, SnipAI } from '../../app/services/supabase.service';

@Component({
  selector: 'app-home',
  template: `
    <div class="w-full">
      <!-- Hero Section -->
      <section class="text-center py-20">
        <div class="max-w-4xl mx-auto px-4">
          <h1 class="text-5xl font-bold text-gray-800 dark:text-white mb-6">
            Smart Snippet Storage with AI
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Store, manage, and enhance your code snippets with the power of AI
          </p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div
              class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              <div class="text-blue-500 mb-4">
                <svg
                  class="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3
                class="text-xl font-semibold text-gray-800 dark:text-white mb-2"
              >
                AI-Powered Analysis
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                Get instant explanations and improvements for your code
              </p>
            </div>

            <div
              class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              <div class="text-green-500 mb-4">
                <svg
                  class="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <h3
                class="text-xl font-semibold text-gray-800 dark:text-white mb-2"
              >
                Code Translation
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                Translate snippets between different programming languages
              </p>
            </div>

            <div
              class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              <div class="text-purple-500 mb-4">
                <svg
                  class="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3
                class="text-xl font-semibold text-gray-800 dark:text-white mb-2"
              >
                Smart Organization
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                Efficiently organize and search your code library
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Recent Snippets Section -->
      <section class="py-12 px-4">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-3xl font-bold text-gray-800 dark:text-white">
            Recent Snippets
          </h2>
          <a
            routerLink="/view"
            class="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
          >
            View All
            <svg
              class="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
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
                <h3
                  class="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                >
                  {{ snippet.title }}
                </h3>
                <span
                  class="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                >
                  {{ snippet.language }}
                </span>
              </div>

              <div class="relative">
                <pre
                  class="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-hidden max-h-32"
                  >{{ snippet.code }}</pre
                >
                <div
                  class="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white dark:from-gray-800 to-transparent"
                ></div>
              </div>

              <div class="mt-4 flex justify-between items-center">
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{ snippet.created_at | date : 'mediumDate' }}
                </span>
                <a
                  [routerLink]="['/view', snippet.id]"
                  class="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                >
                  View Snippet
                  <svg
                    class="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
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
