import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';

import { SupabaseService, SnipAI } from '../../app/services/supabase.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { AIService } from '../../app/services/ai.service';
import { NavbarComponent } from '../../app/navbar/navbar.component';

import {
  CodeTemplate,
  TemplatesService,
} from '../../app/services/templates.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, NavbarComponent, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Left Sidebar -->
        <div class="lg:w-1/4 space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-semibold mb-4 dark:text-white">
              Quick Links
            </h3>
            <div class="space-y-2">
              <a
                *ngFor="let link of quickLinks"
                [routerLink]="link.path"
                class="flex items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
              >
                <span class="mr-3" [innerHTML]="link.icon"></span>
                {{ link.label }}
              </a>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-semibold mb-4 dark:text-white">
              Popular Tags
            </h3>
            <div class="flex flex-wrap gap-2">
              <span
                *ngFor="let tag of popularTags"
                class="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm cursor-pointer hover:bg-blue-100"
              >
                #{{ tag }}
              </span>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="lg:w-3/4">
          <!-- Hero Section -->
          <section class="relative mb-16 overflow-hidden">
            <div
              class="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm"
            ></div>

            <!-- Animated Background Pattern -->
            <div class="absolute inset-0 opacity-10">
              <div
                class="absolute inset-0 bg-grid-slate-800/[0.1] [mask-image:linear-gradient(0deg,white,transparent)]"
              ></div>
              <div
                class="absolute inset-0 bg-gradient-to-br from-indigo-500 to-blue-500 opacity-20"
              ></div>
            </div>

            <div class="relative px-8 py-16 sm:px-12 lg:px-16">
              <div class="max-w-3xl mx-auto text-center">
                <h1
                  class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent"
                >
                  Next-Gen AI Development Tools
                </h1>

                <p
                  class="text-lg md:text-xl mb-8 text-gray-700 dark:text-gray-300"
                >
                  Supercharge your development workflow with AI-powered code
                  generation, management, and optimization
                </p>

                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    (click)="getStarted()"
                    class="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Get Started
                    <svg
                      class="w-5 h-5 ml-2 inline-block"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                  <button
                    (click)="this['watchDemo']()"
                    class="px-8 py-3 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-800 dark:text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 backdrop-blur-sm group"
                  >
                    <svg
                      class="w-5 h-5 mr-2 inline-block text-blue-600 group-hover:animate-pulse"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Watch Demo
                  </button>
                </div>

                <!-- Feature Pills -->
                <div class="flex flex-wrap justify-center gap-3 mt-8">
                  <span
                    class="px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 backdrop-blur-sm"
                  >
                    🤖 AI-Powered
                  </span>
                  <span
                    class="px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 backdrop-blur-sm"
                  >
                    🚀 Blazing Fast
                  </span>
                  <span
                    class="px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 backdrop-blur-sm"
                  >
                    🔒 Secure
                  </span>
                </div>
              </div>
            </div>
          </section>

          <!-- Quick Actions -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div
              *ngFor="let action of this['quickActions']"
              class="group p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300

                        bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900
                        hover:scale-105 cursor-pointer border border-gray-100 dark:border-gray-700"
            >
              <div
                class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4"
              >
                <svg class="w-8 h-8" [innerHTML]="action.icon"></svg>
              </div>
              <h3
                class="text-xl font-semibold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 
                         dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
              >
                {{ action.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                {{ action.description }}
              </p>
            </div>
          </div>

          <!-- AI Code Generation Section -->
          <section
            class="mb-16 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
          >
            <div class="max-w-3xl mx-auto">
              <h2 class="responsive-heading text-center mb-8">
                Generate Code with AI
              </h2>
              <div class="responsive-card space-y-4">
                <select
                  [(ngModel)]="selectedLanguage"
                  class="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="typescript">TypeScript</option>
                  <option value="java">Java</option>
                </select>
                <textarea
                  [(ngModel)]="aiPrompt"
                  rows="4"
                  placeholder="Describe what you want to create..."
                  class="w-full p-3 rounded-lg border dark:bg-gray-700 dark:border-gray-600"
                ></textarea>
                <button
                  (click)="generateWithAI()"
                  [disabled]="!aiPrompt"
                  class="w-full responsive-button bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  Generate Code
                </button>
              </div>
            </div>
          </section>

          <!-- Recent Snippets -->
          <section *ngIf="recentBins.length > 0" class="mb-16">
            <h2 class="responsive-heading text-center mb-8">
              Recent Code Snippets
            </h2>
            <div class="responsive-grid">
              <div
                *ngFor="let bin of recentBins"
                class="responsive-card cursor-pointer tool-card-hover"
                (click)="viewSnippet(bin.id)"
              >
                <h3 class="font-semibold mb-2 truncate">{{ bin.title }}</h3>
                <div class="flex flex-wrap gap-2 items-center text-sm">
                  <span
                    class="category-badge"
                    [class]="getLanguageClass(bin.language)"
                  >
                    {{ bin.language }}
                  </span>
                  <span class="text-gray-500">{{
                    bin.created_at | date : 'short'
                  }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Interactive Language Tabs -->
          <div class="mb-16 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 class="text-2xl font-bold mb-6 dark:text-white">
              Code Examples
            </h2>
            <div class="flex gap-2 mb-4 overflow-x-auto">
              <button
                *ngFor="let lang of featuredLanguages"
                (click)="selectedLanguage = lang"
                [class.bg-blue-600]="selectedLanguage === lang"
                [class.text-white]="selectedLanguage === lang"
                class="px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
              >
                {{ lang }}
              </button>
            </div>
            <pre
              class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto"
            ><code [class]="'language-' + selectedLanguage">{{ getCodeExample(selectedLanguage) }}</code></pre>
          </div>

          <!-- Quick Stats Cards with Hover Effects -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div
              *ngFor="let stat of quickStats"
              class="group p-6 rounded-xl shadow-lg transition-all duration-300
                     bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-900/20 dark:to-indigo-900/20
                     hover:from-blue-500/20 hover:to-indigo-500/20 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30
                     hover:shadow-xl hover:scale-105 cursor-pointer backdrop-blur-sm"
              (click)="showStatDetails(stat)"
            >
              <div
                class="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 
                          bg-clip-text text-transparent"
              >
                {{ stat.value }}
              </div>
              <div class="text-gray-700 dark:text-gray-300 font-medium">
                {{ stat.label }}
              </div>
            </div>
          </div>

          <!-- Interactive Feature Cards -->
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
          >
            <div
              *ngFor="let feature of features"
              class="group p-6 rounded-xl shadow-lg transition-all duration-300
                     bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900
                     hover:shadow-2xl hover:scale-105 cursor-pointer border border-gray-100 dark:border-gray-700
                     relative overflow-hidden"
              [class.scale-105]="feature.isActive"
              (mouseenter)="feature.isActive = true"
              (mouseleave)="feature.isActive = false"
            >
              <!-- Gradient Overlay -->
              <div
                class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 
                          group-hover:from-blue-500/10 group-hover:to-indigo-500/10 transition-all duration-300"
              ></div>

              <div class="relative">
                <div class="flex items-center gap-4 mb-4">
                  <div
                    class="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 
                              dark:from-blue-900/50 dark:to-indigo-900/50"
                  >
                    <i
                      [class]="
                        feature.icon +
                        ' text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'
                      "
                    ></i>
                  </div>
                  <h3
                    class="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-700 
                             dark:from-white dark:to-gray-300 bg-clip-text text-transparent"
                  >
                    {{ feature.title }}
                  </h3>
                </div>
                <p class="text-gray-600 dark:text-gray-400">
                  {{ feature.description }}
                </p>
                <div
                  class="mt-4 overflow-hidden transform transition-all duration-300"
                  [class.opacity-0]="!feature.isActive"
                  [class.opacity-100]="feature.isActive"
                  [class.translate-y-4]="!feature.isActive"
                  [class.translate-y-0]="feature.isActive"
                >
                  <a
                    [routerLink]="feature.link"
                    class="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Learn more
                    <svg
                      class="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
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
              </div>
            </div>
          </div>

          <!-- Newsletter Signup -->
          <div
            class="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white mb-16"
          >
            <div class="max-w-2xl mx-auto text-center">
              <h2 class="text-2xl font-bold mb-4">Stay Updated</h2>
              <p class="mb-6">
                Get the latest updates about new features and improvements.
              </p>
              <div class="flex gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  [(ngModel)]="emailSubscribe"
                  placeholder="Enter your email"
                  class="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/70"
                />
                <button
                  (click)="subscribeNewsletter()"
                  class="px-6 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Sidebar -->
        <div class="lg:w-1/4 space-y-6 ">
          <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6  top-6"
          >
            <h3 class="text-lg font-semibold mb-4 dark:text-white">
              Latest Activity
            </h3>
            <div class="space-y-4">
              <div
                *ngFor="let activity of recentActivity"
                class="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                <div
                  class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm"
                >
                  {{ activity.user.charAt(0) }}
                </div>
                <div>
                  <p class="text-sm text-gray-700 dark:text-gray-300">
                    <span class="font-medium">{{ activity.user }}</span>
                    {{ activity.action }}
                  </p>
                  <span class="text-xs text-gray-500">{{ activity.time }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-semibold mb-4 dark:text-white">
              Trending Templates
            </h3>
            <div class="space-y-3">
              <div
                *ngFor="let template of trendingTemplates"
                class="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
              >
                <div class="flex justify-between items-start">
                  <h4 class="font-medium dark:text-white">
                    {{ template.name }}
                  </h4>
                  <span
                    class="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded"
                  >
                    {{ template.language }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {{ template.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Featured Templates -->
      <section class="mt-16">
        <h2 class="text-2xl font-bold mb-6 dark:text-white">
          Featured Templates
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            *ngFor="let template of featuredTemplates"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <h3 class="text-lg font-semibold mb-2 dark:text-white">
              {{ template.name }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              {{ template.description }}
            </p>
            <button
              (click)="useTemplate(template)"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Use Template
            </button>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  [x: string]: any;
  recentBins: SnipAI[] = [];
  aiPrompt: string = '';
  selectedLanguage: string = 'javascript';
  isLoggedIn = false;
  demoSnippetId = 'demo-123'; // Replace with an actual demo snippet ID
  featuredTemplates: CodeTemplate[] = [];
  statistics = {
    totalSnippets: 0,
    totalLanguages: 0,
    aiGenerated: 0,
  };

  activeTab = 'all';
  isStatsExpanded = false;
  featuredLanguages = ['typescript', 'javascript', 'python', 'java'];
  codeExamples = {
    typescript: `interface User {
  id: string;
  name: string;
}`,
    javascript: `function greet(name) {
  return \`Hello, \${name}!\`;
}`,
    python: `def calculate(x, y):
    return x + y`,
    java: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello!");
  }
}`,
  };

  emailSubscribe = '';

  quickLinks = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: '<svg class="w-5 h-5">...</svg>',
    },
    {
      label: 'My Snippets',
      path: '/view',
      icon: '<svg class="w-5 h-5">...</svg>',
    },
    {
      label: 'AI Tools',
      path: '/ai-tools-page',
      icon: '<svg class="w-5 h-5">...</svg>',
    },
    {
      label: 'Templates',
      path: '/templates',
      icon: '<svg class="w-5 h-5">...</svg>',
    },
  ];

  popularTags = [
    'javascript',
    'react',
    'typescript',
    'python',
    'api',
    'testing',
    'utils',
  ];

  recentActivity = [
    { user: 'John Doe', action: 'created a new snippet', time: '5m ago' },
    { user: 'Alice Smith', action: 'used AI generation', time: '15m ago' },
    { user: 'Bob Wilson', action: 'shared a template', time: '1h ago' },
    { user: 'Emma Davis', action: 'updated documentation', time: '2h ago' },
  ];

  trendingTemplates = [
    {
      name: 'API Endpoint',
      language: 'TypeScript',
      description: 'REST API endpoint with error handling',
    },
    {
      name: 'React Hook',
      language: 'JavaScript',
      description: 'Custom React hook template',
    },
    {
      name: 'Auth Middleware',
      language: 'Python',
      description: 'Authentication middleware setup',
    },
  ];

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    private toastr: ToastrService,
    private aiService: AIService,
    public service: SharedService,
    private templatesService: TemplatesService
  ) {}

  async ngOnInit() {
    this.service.loginOrNotLoggedIn = true;
    try {
      this.recentBins = await this.supabaseService.getUserCodeBins();
      this.recentBins = this.recentBins.slice(0, 6); // Show only 6 most recent snippets
    } catch (error) {
      console.error('Error fetching recent snippets:', error);
    }

    // Check login status
    const session = await this.supabaseService.getCurrentUser();
    this.isLoggedIn = !!session.data.user;

    // Add new initializations
    await Promise.all([this.loadStatistics(), this.loadFeaturedTemplates()]);
  }

  viewSnippet(id: string | undefined) {
    if (id) {
      this.router.navigate(['/view', id]);
    }
  }

  createNewSnippet(language: string) {
    this.router.navigate(['/bin'], {
      queryParams: { language },
    });
  }

  async generateWithAI() {
    if (!this.aiPrompt) return;

    try {
      this.toastr.info('Generating code...');
      const generatedCode = await this.aiService.generateCode(
        this.aiPrompt,
        this.selectedLanguage
      );

      // Get current user
      const user = await this.supabaseService.getCurrentUser();
      if (!user.data.user) {
        throw new Error('User not authenticated');
      }

      // Create new snippet with user_id
      const newSnippet: Partial<SnipAI> = {
        title: this.aiPrompt.slice(0, 50) + '...',
        code: generatedCode,
        language: this.selectedLanguage,
        category: 'AI Generated',
        user_id: user.data.user.id, // Add user ID
      };

      const createdSnippet = await this.supabaseService.createCodeBin(
        newSnippet as SnipAI
      );
      this.toastr.success('Code generated successfully');
      this.router.navigate(['/view', createdSnippet.id]);
    } catch (error) {
      this.toastr.error('Error generating code');
      console.error('Generation error:', error);
    }
  }

  getLanguageClass(language: string): string {
    const classes = {
      javascript:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      typescript:
        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      python:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      // Add more languages
    };
    return (
      classes[language.toLowerCase() as keyof typeof classes] ||
      'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    );
  }

  async getStarted() {
    if (this.isLoggedIn) {
      // Navigate to new snippet creation
      this.router.navigate(['/bin'], {
        queryParams: { language: 'javascript' },
      });
    } else {
      const shouldSignUp = confirm(
        'Would you like to create a free account to get started?'
      );
      if (shouldSignUp) {
        this.router.navigate(['/signup']);
      } else {
        this.router.navigate(['/login']);
      }
    }
  }

  async viewDemo() {
    try {
      // Navigate to demo page
      await this.router.navigate(['/demo']);
    } catch (error) {
      this.toastr.error('Error loading demo');
      console.error('Demo error:', error);
    }
  }

  private async startGuidedTour() {
    // Define tour steps
    const tourSteps = [
      {
        element: '#ai-tools',
        title: 'AI Tools',
        content: 'Generate, explain, and optimize code using our AI tools.',
      },
      {
        element: '#snippet-storage',
        title: 'Snippet Storage',
        content:
          'Save and organize your code snippets with tags and categories.',
      },
      {
        element: '#code-editor',
        title: 'Code Editor',
        content:
          'Write and edit code with syntax highlighting and auto-completion.',
      },
    ];

    // Store tour state
    sessionStorage.setItem('show-tour', 'true');
    sessionStorage.setItem('tour-steps', JSON.stringify(tourSteps));

    // Navigate to first feature
    this.router.navigate(['/ai-tools-page'], {
      queryParams: { tour: 'true' },
    });
  }

  private async loadStatistics() {
    try {
      const stats = await this.supabaseService['getStatistics']();
      this.statistics = {
        totalSnippets: stats.totalSnippets || 0,
        totalLanguages: stats.uniqueLanguages || 0,
        aiGenerated: stats.aiGenerated || 0,
      };
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  }

  private async loadFeaturedTemplates() {
    try {
      this.featuredTemplates = await this.templatesService[
        'getFeaturedTemplates'
      ]();
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  }

  async useTemplate(template: CodeTemplate) {
    try {
      const code = await this.templatesService['generateFromTemplate'](
        template
      );
      const newSnippet: SnipAI = {
        title: `${template.name} Template`,
        code,
        language: template.language,
        description: template.description,
        category: 'Templates',
        tags: ['template', template.language],
        user_id: await this['getUserId'](),
        is_public: false,
      };

      await this.supabaseService.createCodeBin(newSnippet);
      this.toastr.success('Template code generated and saved');
      this.router.navigate(['/view']);
    } catch (error) {
      this.toastr.error('Error using template');
      console.error('Template error:', error);
    }
  }

  quickStats = [
    {
      label: 'Active Users',
      value: '1,234',
      colorClass: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Code Snippets',
      value: '5,678',
      colorClass: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'AI Generations',
      value: '10K+',
      colorClass: 'text-purple-600 dark:text-purple-400',
    },
  ];

  features = [
    {
      title: 'AI Code Generation',
      description: 'Generate code snippets using advanced AI',
      icon: 'fas fa-robot',
      iconClass: 'text-blue-600',
      link: '/ai-tools-page',
      isActive: false,
    },
    // ... add more features
  ];

  showStatDetails(stat: any) {
    this.toastr.info(`More details about ${stat.label}`);
  }

  subscribeNewsletter() {
    if (!this.emailSubscribe) {
      this.toastr.warning('Please enter your email');
      return;
    }
    this.toastr.success('Thanks for subscribing!');
    this.emailSubscribe = '';
  }

  getCodeExample(lang: string): string {
    return this.codeExamples[lang as keyof typeof this.codeExamples];
  }
}
