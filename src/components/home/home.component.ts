import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedService } from '../../services/shared.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { SupabaseService, SnipAI } from '../../app/services/supabase.service';

@Component({
  selector: 'app-home',
  template: `
    <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <!-- Hero Section -->
      <div class="container mx-auto px-4 pt-20 pb-16">
        <div class="text-center">
          <h1 class="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Next-Gen AI Development Tools
          </h1>
          <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Supercharge your development workflow with AI-powered tools for coding, testing, and documentation
          </p>
          <div class="flex justify-center gap-4">
            <button class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Get Started
            </button>
            <button class="px-8 py-3 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
              View Demo
            </button>
          </div>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="container mx-auto px-4 py-16">
        <h2 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Powerful Features for Modern Development
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature Cards -->
          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Smart Code Generation</h3>
            <p class="text-gray-600 dark:text-gray-300">Generate production-ready code from natural language descriptions</p>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Automated Testing</h3>
            <p class="text-gray-600 dark:text-gray-300">Generate comprehensive test suites with AI-powered test case generation</p>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <svg class="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Code Optimization</h3>
            <p class="text-gray-600 dark:text-gray-300">Automatically optimize your code for better performance and efficiency</p>
          </div>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="bg-blue-600 dark:bg-blue-900">
        <div class="container mx-auto px-4 py-16">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div class="text-4xl font-bold text-white mb-2">500K+</div>
              <div class="text-blue-100">Lines of Code Generated</div>
            </div>
            <div>
              <div class="text-4xl font-bold text-white mb-2">10K+</div>
              <div class="text-blue-100">Happy Developers</div>
            </div>
            <div>
              <div class="text-4xl font-bold text-white mb-2">99%</div>
              <div class="text-blue-100">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="container mx-auto px-4 py-16 text-center">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Ready to Transform Your Development Workflow?
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of developers who are already using our AI-powered tools to write better code faster.
        </p>
        <button class="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Start Free Trial
        </button>
      </div>
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
