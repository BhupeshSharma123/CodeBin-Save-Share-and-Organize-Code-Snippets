// about.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="w-full">
      <!-- Hero Section -->
      <section class="text-center py-16">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          About SnipAI
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Your intelligent code snippet manager powered by AI
        </p>
      </section>

      <!-- Features Grid -->
      <section class="py-12 px-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- AI Features -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <div class="text-blue-500 mb-4">
              <svg
                class="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3
              class="text-xl font-semibold text-gray-900 dark:text-white mb-2"
            >
              AI-Powered Features
            </h3>
            <ul class="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Code explanation and analysis</li>
              <li>• Automatic code improvements</li>
              <li>• Smart language translation</li>
              <li>• Intelligent categorization</li>
            </ul>
          </div>

          <!-- Organization -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <div class="text-green-500 mb-4">
              <svg
                class="w-12 h-12"
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
            </div>
            <h3
              class="text-xl font-semibold text-gray-900 dark:text-white mb-2"
            >
              Smart Organization
            </h3>
            <ul class="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Automatic categorization</li>
              <li>• Advanced search capabilities</li>
              <li>• Custom tagging system</li>
              <li>• Intuitive file management</li>
            </ul>
          </div>

          <!-- Collaboration -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <div class="text-purple-500 mb-4">
              <svg
                class="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>
            </div>
            <h3
              class="text-xl font-semibold text-gray-900 dark:text-white mb-2"
            >
              Easy Sharing
            </h3>
            <ul class="space-y-2 text-gray-600 dark:text-gray-300">
              <li>• Quick social sharing</li>
              <li>• Secure link generation</li>
              <li>• Team collaboration</li>
              <li>• Version control</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Tech Stack -->
      <section class="py-12 px-4">
        <h2
          class="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center"
        >
          Built with Modern Technology
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div class="flex flex-col items-center">
            <img
              src="assets/angular.svg"
              alt="Angular"
              class="w-16 h-16 mb-2"
            />
            <span class="text-gray-700 dark:text-gray-300">Angular</span>
          </div>
          <div class="flex flex-col items-center">
            <img
              src="assets/tailwind.svg"
              alt="Tailwind"
              class="w-16 h-16 mb-2"
            />
            <span class="text-gray-700 dark:text-gray-300">Tailwind CSS</span>
          </div>
          <div class="flex flex-col items-center">
            <img
              src="assets/supabase.svg"
              alt="Supabase"
              class="w-16 h-16 mb-2"
            />
            <span class="text-gray-700 dark:text-gray-300">Supabase</span>
          </div>
          <div class="flex flex-col items-center">
            <img src="assets/openai.svg" alt="OpenAI" class="w-16 h-16 mb-2" />
            <span class="text-gray-700 dark:text-gray-300">OpenAI</span>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-16 px-4 text-center">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to Get Started?
        </h2>
        <p
          class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
        >
          Join thousands of developers who are already using SnipAI to manage
          their code snippets more efficiently.
        </p>
        <div class="flex justify-center space-x-4">
          <a
            routerLink="/signup"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Sign Up Now
          </a>
          <a
            routerLink="/login"
            class="px-6 py-3 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors duration-200"
          >
            Login
          </a>
        </div>
      </section>
    </div>
  `,
})
export class AboutComponent {}
