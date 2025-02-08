import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AIToolsComponent } from '../../components/ai-tools/ai-tools.component';
import { AITool } from '../../interfaces/ai-tool.interface';
import { AIToolsService } from '../../app/services/ai-tools.service';
import { ToastrService } from 'ngx-toastr';
import { MarkdownModule } from 'ngx-markdown';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
} from '@angular/animations';

@Component({
  selector: 'app-ai-tools-page',
  standalone: true,
  imports: [CommonModule, FormsModule, AIToolsComponent],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '0.5s ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('staggerList', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            stagger('100ms', [
              animate(
                '0.5s ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900"
    >
      <!-- Hero Section -->
      <div class="relative py-20 overflow-hidden">
        <div class="absolute inset-0 z-0">
          <div
            class="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-gradient"
          ></div>
          <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
        </div>

        <div class="container mx-auto px-4 relative z-10">
          <div class="text-center mb-16" @fadeInUp>
            <h1
              class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
            >
              AI-Powered Development Tools
            </h1>
            <p
              class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            >
              Supercharge your development workflow with our suite of
              intelligent tools
            </p>
          </div>
        </div>
      </div>

      <!-- Tools Grid -->
      <div class="container mx-auto px-4 py-12">
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          @staggerList
        >
          <div
            *ngFor="let tool of tools"
            class="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            [class.active]="tool.isActive"
            (click)="selectTool(tool)"
          >
            <!-- Background Pattern -->
            <div
              class="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
              [ngStyle]="{
                'background-image': 'url(' + tool.backgroundPattern + ')'
              }"
            ></div>

            <!-- Content -->
            <div class="p-8 relative">
              <!-- Icon -->
              <div
                class="w-16 h-16 rounded-2xl mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                [class]="tool.iconBackground"
              >
                <div [innerHTML]="tool.icon" class="w-8 h-8 text-white"></div>
              </div>

              <!-- Text -->
              <h3
                class="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
              >
                {{ tool.name }}
              </h3>
              <p class="text-gray-600 dark:text-gray-300">
                {{ tool.description }}
              </p>

              <!-- Category Badge -->
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-4"
                [class]="getCategoryClass(tool.category)"
              >
                {{ tool.category }}
              </span>

              <!-- Hover Effect -->
              <div
                class="absolute inset-0 border-2 border-transparent group-hover:border-blue-500 rounded-2xl transition-colors duration-300"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Tool Content -->
      <div *ngIf="selectedTool" class="container mx-auto px-4 py-12" @fadeInUp>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            {{ selectedTool.name }}
          </h2>

          <!-- Code Generator Tool -->
          <div *ngIf="selectedTool.id === 'code-generator'" class="space-y-4">
            <div class="flex flex-col space-y-2">
              <label class="text-gray-700 dark:text-gray-300"
                >Description</label
              >
              <textarea
                [(ngModel)]="codeDescription"
                rows="4"
                class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Describe the code you want to generate..."
              ></textarea>
            </div>

            <div class="flex items-center space-x-4">
              <select
                [(ngModel)]="selectedLanguage"
                class="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
              </select>

              <button
                (click)="generateCode()"
                [disabled]="isProcessing"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center space-x-2"
              >
                <span>{{
                  isProcessing ? 'Generating...' : 'Generate Code'
                }}</span>
                <div
                  *ngIf="isProcessing"
                  class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                ></div>
              </button>
            </div>
          </div>

          <!-- Code Debugger Tool -->
          <div *ngIf="selectedTool.id === 'code-debugger'" class="space-y-4">
            <div class="flex flex-col space-y-2">
              <label class="text-gray-700 dark:text-gray-300"
                >Code to Debug</label
              >
              <textarea
                [(ngModel)]="codeToDebug"
                rows="8"
                class="w-full p-2 border rounded-lg font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Paste your code here..."
              ></textarea>
            </div>

            <div class="flex items-center space-x-4">
              <select
                [(ngModel)]="selectedLanguage"
                class="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
              </select>

              <button
                (click)="debugCode()"
                [disabled]="isProcessing"
                class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center space-x-2"
              >
                <span>{{ isProcessing ? 'Analyzing...' : 'Debug Code' }}</span>
                <div
                  *ngIf="isProcessing"
                  class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                ></div>
              </button>
            </div>

            <!-- Debug Results -->
            <div *ngIf="debugResults" class="mt-6 space-y-6">
              <div *ngIf="debugResults.errors.length > 0" class="space-y-2">
                <h3
                  class="text-lg font-semibold text-red-600 dark:text-red-400"
                >
                  Found Issues
                </h3>
                <ul class="list-disc list-inside space-y-1">
                  <li
                    *ngFor="let error of debugResults.errors"
                    class="text-red-600 dark:text-red-400"
                  >
                    {{ error }}
                  </li>
                </ul>
              </div>

              <div
                *ngIf="debugResults.suggestions.length > 0"
                class="space-y-2"
              >
                <h3
                  class="text-lg font-semibold text-green-600 dark:text-green-400"
                >
                  Suggestions
                </h3>
                <ul class="list-disc list-inside space-y-1">
                  <li
                    *ngFor="let suggestion of debugResults.suggestions"
                    class="text-green-600 dark:text-green-400"
                  >
                    {{ suggestion }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Generated Code Output -->
          <div *ngIf="generatedCode" class="mt-4">
            <div class="flex justify-between items-center mb-2">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                Output
              </h3>
              <button
                (click)="copyToClipboard()"
                class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Copy
              </button>
            </div>
            <pre
              class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto"
            ><code>{{ generatedCode }}</code></pre>
          </div>

          <!-- Code Optimizer Tool -->
          <div *ngIf="selectedTool.id === 'code-optimizer'" class="space-y-4">
            <div class="flex flex-col space-y-2">
              <label class="text-gray-700 dark:text-gray-300"
                >Code to Optimize</label
              >
              <textarea
                [(ngModel)]="codeToOptimize"
                rows="8"
                class="w-full p-2 border rounded-lg font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Paste your code here for optimization..."
              ></textarea>
            </div>

            <div class="flex items-center space-x-4">
              <select
                [(ngModel)]="selectedLanguage"
                class="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
              </select>

              <button
                (click)="optimizeCode()"
                [disabled]="isProcessing"
                class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 flex items-center space-x-2"
              >
                <span>{{
                  isProcessing ? 'Optimizing...' : 'Optimize Code'
                }}</span>
                <div
                  *ngIf="isProcessing"
                  class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                ></div>
              </button>
            </div>

            <!-- Optimization Results -->
            <div *ngIf="optimizationResults" class="mt-6 space-y-6">
              <!-- Performance Gain -->
              <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3
                  class="text-lg font-semibold text-green-600 dark:text-green-400"
                >
                  Performance Improvement
                </h3>
                <p class="text-green-600 dark:text-green-400">
                  {{ optimizationResults.performanceGain }}
                </p>
              </div>

              <!-- Improvements List -->
              <div class="space-y-2">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                  Optimizations Applied
                </h3>
                <ul class="list-disc list-inside space-y-1">
                  <li
                    *ngFor="let improvement of optimizationResults.improvements"
                    class="text-gray-600 dark:text-gray-300"
                  >
                    {{ improvement }}
                  </li>
                </ul>
              </div>

              <!-- Optimized Code -->
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <h3
                    class="text-lg font-semibold text-gray-800 dark:text-white"
                  >
                    Optimized Code
                  </h3>
                  <button
                    (click)="copyToClipboard()"
                    class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Copy
                  </button>
                </div>
                <pre
                  class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto"
                ><code>{{ optimizationResults.optimizedCode }}</code></pre>
              </div>
            </div>
          </div>

          <!-- Code Explainer Tool -->
          <div *ngIf="selectedTool.id === 'code-explainer'" class="space-y-4">
            <div class="flex flex-col space-y-2">
              <label class="text-gray-700 dark:text-gray-300"
                >Code to Explain</label
              >
              <textarea
                [(ngModel)]="codeToExplain"
                rows="8"
                class="w-full p-2 border rounded-lg font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Paste your code here for explanation..."
              ></textarea>
            </div>

            <div class="flex items-center space-x-4">
              <select
                [(ngModel)]="selectedLanguage"
                class="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
              </select>

              <button
                (click)="explainCode()"
                [disabled]="isProcessing"
                class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 flex items-center space-x-2"
              >
                <span>{{
                  isProcessing ? 'Analyzing...' : 'Explain Code'
                }}</span>
                <div
                  *ngIf="isProcessing"
                  class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                ></div>
              </button>
            </div>

            <!-- Explanation Results -->
            <div *ngIf="explanationResults" class="mt-6 space-y-6">
              <!-- Overview Section -->
              <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3
                  class="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2"
                >
                  Overview
                </h3>
                <p class="text-blue-600 dark:text-blue-400">
                  {{ explanationResults.explanation.overview }}
                </p>
                <p class="text-blue-600 dark:text-blue-400 mt-2">
                  {{ explanationResults.explanation.complexity }}
                </p>
              </div>

              <!-- Key Points -->
              <div class="space-y-2">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                  Key Points
                </h3>
                <ul class="list-disc list-inside space-y-1">
                  <li
                    *ngFor="
                      let point of explanationResults.explanation.keyPoints
                    "
                    class="text-gray-600 dark:text-gray-300"
                  >
                    {{ point }}
                  </li>
                </ul>
              </div>

              <!-- Commented Code -->
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <h3
                    class="text-lg font-semibold text-gray-800 dark:text-white"
                  >
                    Commented Code
                  </h3>
                  <button
                    (click)="copyToClipboard()"
                    class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Copy
                  </button>
                </div>
                <pre
                  class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto"
                ><code>{{ explanationResults.commentedCode }}</code></pre>
              </div>
            </div>
          </div>

          <!-- Code Translator Tool -->
          <div *ngIf="selectedTool.id === 'code-translator'" class="space-y-4">
            <div class="flex flex-col space-y-2">
              <label class="text-gray-700 dark:text-gray-300"
                >Code to Translate</label
              >
              <textarea
                [(ngModel)]="codeToTranslate"
                rows="8"
                class="w-full p-2 border rounded-lg font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Paste your code here for translation..."
              ></textarea>
            </div>

            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2">
                <label class="text-sm text-gray-600 dark:text-gray-400"
                  >From:</label
                >
                <select
                  [(ngModel)]="fromLanguage"
                  class="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                </select>
              </div>

              <svg
                class="w-6 h-6 text-gray-400"
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

              <div class="flex items-center space-x-2">
                <label class="text-sm text-gray-600 dark:text-gray-400"
                  >To:</label
                >
                <select
                  [(ngModel)]="toLanguage"
                  class="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="java">Java</option>
                </select>
              </div>

              <button
                (click)="translateCode()"
                [disabled]="isProcessing"
                class="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 flex items-center space-x-2"
              >
                <span>{{
                  isProcessing ? 'Translating...' : 'Translate Code'
                }}</span>
                <div
                  *ngIf="isProcessing"
                  class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                ></div>
              </button>
            </div>

            <!-- Translation Results -->
            <div *ngIf="translationResults" class="mt-6 space-y-6">
              <!-- Compatibility Info -->
              <div class="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <div class="flex items-center space-x-2 mb-2">
                  <h3
                    class="text-lg font-semibold text-gray-800 dark:text-white"
                  >
                    Compatibility
                  </h3>
                  <span
                    [class]="
                      getCompatibilityColor(
                        translationResults.compatibility.level
                      )
                    "
                    class="px-2 py-1 rounded-full text-sm font-medium"
                  >
                    {{ translationResults.compatibility.level | titlecase }}
                    Compatibility
                  </span>
                </div>
                <ul class="list-disc list-inside space-y-1">
                  <li
                    *ngFor="
                      let issue of translationResults.compatibility.issues
                    "
                    class="text-gray-600 dark:text-gray-400"
                  >
                    {{ issue }}
                  </li>
                </ul>
              </div>

              <!-- Translation Notes -->
              <div class="space-y-2">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                  Translation Notes
                </h3>
                <ul class="list-disc list-inside space-y-1">
                  <li
                    *ngFor="let note of translationResults.notes"
                    class="text-gray-600 dark:text-gray-300"
                  >
                    {{ note }}
                  </li>
                </ul>
              </div>

              <!-- Translated Code -->
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <h3
                    class="text-lg font-semibold text-gray-800 dark:text-white"
                  >
                    Translated Code
                  </h3>
                  <button
                    (click)="copyToClipboard()"
                    class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Copy
                  </button>
                </div>
                <pre
                  class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto"
                ><code>{{ translationResults.translatedCode }}</code></pre>
              </div>
            </div>
          </div>

          <!-- Documentation Generator Tool -->
          <div *ngIf="selectedTool.id === 'doc-generator'" class="space-y-4">
            <div class="flex flex-col space-y-2">
              <label class="text-gray-700 dark:text-gray-300"
                >Code or Project Details</label
              >
              <textarea
                [(ngModel)]="docGeneratorInput"
                rows="8"
                class="w-full p-2 border rounded-lg font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Paste your code or project details here..."
              ></textarea>
            </div>

            <div class="flex items-center space-x-4">
              <input
                [(ngModel)]="projectName"
                type="text"
                placeholder="Project Name"
                class="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />

              <select
                [(ngModel)]="docType"
                class="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="readme">README</option>
                <option value="api">API Documentation</option>
                <option value="jsdoc">JSDoc</option>
              </select>

              <button
                (click)="generateDocumentation()"
                [disabled]="isProcessing"
                class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 flex items-center space-x-2"
              >
                <span>{{
                  isProcessing ? 'Generating...' : 'Generate Documentation'
                }}</span>
                <div
                  *ngIf="isProcessing"
                  class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                ></div>
              </button>
            </div>

            <!-- Documentation Results -->
            <div *ngIf="docResults" class="mt-6 space-y-6">
              <!-- Metadata Section -->
              <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3
                  class="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4"
                >
                  Project Information
                </h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <!-- Dependencies -->
                  <div *ngIf="docResults.metadata.dependencies?.length">
                    <h4
                      class="font-medium text-blue-600 dark:text-blue-400 mb-2"
                    >
                      Dependencies
                    </h4>
                    <ul class="list-disc list-inside">
                      <li
                        *ngFor="let dep of docResults.metadata.dependencies"
                        class="text-gray-600 dark:text-gray-300"
                      >
                        {{ dep }}
                      </li>
                    </ul>
                  </div>
                  <!-- API Endpoints -->
                  <div *ngIf="docResults.metadata.apiEndpoints?.length">
                    <h4
                      class="font-medium text-blue-600 dark:text-blue-400 mb-2"
                    >
                      API Endpoints
                    </h4>
                    <ul class="list-disc list-inside">
                      <li
                        *ngFor="
                          let endpoint of docResults.metadata.apiEndpoints
                        "
                        class="text-gray-600 dark:text-gray-300"
                      >
                        {{ endpoint }}
                      </li>
                    </ul>
                  </div>
                  <!-- Examples -->
                  <div *ngIf="docResults.metadata.examples?.length">
                    <h4
                      class="font-medium text-blue-600 dark:text-blue-400 mb-2"
                    >
                      Examples
                    </h4>
                    <ul class="list-disc list-inside">
                      <li
                        *ngFor="let example of docResults.metadata.examples"
                        class="text-gray-600 dark:text-gray-300"
                      >
                        {{ example }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Documentation Content -->
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <h3
                    class="text-lg font-semibold text-gray-800 dark:text-white"
                  >
                    Generated Documentation
                  </h3>
                  <button
                    (click)="copyToClipboard()"
                    class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Copy
                  </button>
                </div>
                <pre
                  class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap"
                  >{{ docResults.documentation }}</pre
                >
              </div>

              <!-- Sections -->
              <div *ngIf="docResults.sections?.length" class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                  Sections
                </h3>
                <div
                  *ngFor="let section of docResults.sections"
                  class="space-y-2"
                >
                  <h4 class="font-medium text-gray-700 dark:text-gray-300">
                    {{ section.title }}
                  </h4>
                  <p class="text-gray-600 dark:text-gray-400">
                    {{ section.content }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Regex Generator Tool -->
          <div *ngIf="selectedTool.id === 'regex-generator'" class="space-y-4">
            <div class="flex flex-col space-y-2">
              <label class="text-gray-700 dark:text-gray-300"
                >Pattern Description</label
              >
              <textarea
                [(ngModel)]="regexDescription"
                rows="3"
                class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Describe the pattern you want to match (e.g., 'Match valid email addresses')..."
              ></textarea>
            </div>

            <div class="flex items-center space-x-4">
              <input
                [(ngModel)]="regexFlags"
                type="text"
                placeholder="Flags (e.g., gi)"
                class="p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white w-24"
              />

              <button
                (click)="generateRegex()"
                [disabled]="isProcessing"
                class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center space-x-2"
              >
                <span>{{
                  isProcessing ? 'Generating...' : 'Generate Regex'
                }}</span>
                <div
                  *ngIf="isProcessing"
                  class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                ></div>
              </button>
            </div>

            <!-- Regex Results -->
            <div *ngIf="regexResults" class="mt-6 space-y-6">
              <!-- Pattern Section -->
              <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div class="flex justify-between items-center mb-2">
                  <h3
                    class="text-lg font-semibold text-green-600 dark:text-green-400"
                  >
                    Generated Pattern
                  </h3>
                  <button
                    (click)="copyToClipboard()"
                    class="px-3 py-1 text-sm bg-green-100 dark:bg-green-800 rounded-lg"
                  >
                    Copy
                  </button>
                </div>
                <code class="block p-2 bg-white dark:bg-gray-800 rounded mt-2">
                  {{ regexResults.pattern }}
                </code>
              </div>

              <!-- Explanation -->
              <div class="space-y-2">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                  Pattern Explanation
                </h3>
                <ul class="list-disc list-inside space-y-1">
                  <li
                    *ngFor="let exp of regexResults.explanation"
                    class="text-gray-600 dark:text-gray-300"
                  >
                    {{ exp }}
                  </li>
                </ul>
              </div>

              <!-- Test Section -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                  Test Pattern
                </h3>
                <div class="flex space-x-4">
                  <input
                    [(ngModel)]="testInput"
                    type="text"
                    placeholder="Enter test string"
                    class="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <span
                    [class]="
                      testRegex(testInput) ? 'text-green-500' : 'text-red-500'
                    "
                    class="flex items-center font-medium"
                  >
                    {{ testRegex(testInput) ? 'Matches' : 'No match' }}
                  </span>
                </div>
              </div>

              <!-- Examples -->
              <div class="space-y-2">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                  Example Matches
                </h3>
                <ul class="list-disc list-inside space-y-1">
                  <li
                    *ngFor="let example of regexResults.examples"
                    class="text-gray-600 dark:text-gray-300"
                  >
                    {{ example }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- SQL Query Builder Tool -->
          <div *ngIf="selectedTool.id === 'sql-builder'" class="space-y-4">
            <div class="flex flex-col space-y-2">
              <label class="text-gray-700 dark:text-gray-300"
                >Query Description</label
              >
              <textarea
                [(ngModel)]="queryDescription"
                rows="4"
                class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Describe what you want your SQL query to do..."
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  class="block text-sm text-gray-700 dark:text-gray-300 mb-1"
                  >Database Type</label
                >
                <select
                  [(ngModel)]="dbType"
                  class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="postgresql">PostgreSQL</option>
                  <option value="mysql">MySQL</option>
                  <option value="sqlite">SQLite</option>
                </select>
              </div>

              <div>
                <label
                  class="block text-sm text-gray-700 dark:text-gray-300 mb-1"
                  >Query Type</label
                >
                <select
                  [(ngModel)]="queryType"
                  class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="select">SELECT</option>
                  <option value="insert">INSERT</option>
                  <option value="update">UPDATE</option>
                  <option value="delete">DELETE</option>
                </select>
              </div>

              <div>
                <label
                  class="block text-sm text-gray-700 dark:text-gray-300 mb-1"
                  >Tables (comma-separated)</label
                >
                <input
                  [(ngModel)]="tables"
                  type="text"
                  class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="users, orders, products"
                />
              </div>
            </div>

            <div class="flex justify-end">
              <button
                (click)="generateSQLQuery()"
                [disabled]="isProcessing"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center space-x-2"
              >
                <span>{{
                  isProcessing ? 'Generating...' : 'Generate Query'
                }}</span>
                <div
                  *ngIf="isProcessing"
                  class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                ></div>
              </button>
            </div>

            <!-- SQL Results -->
            <div *ngIf="sqlResults" class="mt-6 space-y-6">
              <!-- Generated Query -->
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <h3
                    class="text-lg font-semibold text-gray-800 dark:text-white"
                  >
                    Generated Query
                  </h3>
                  <button
                    (click)="copyToClipboard()"
                    class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Copy
                  </button>
                </div>
                <pre
                  class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto"
                  >{{ sqlResults.query }}</pre
                >
                <p class="text-gray-600 dark:text-gray-400 mt-2">
                  {{ sqlResults.explanation }}
                </p>
              </div>

              <!-- Optimization Suggestions -->
              <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <h3
                  class="text-lg font-semibold text-yellow-600 dark:text-yellow-400 mb-2"
                >
                  Optimization Suggestions
                </h3>
                <ul class="list-disc list-inside space-y-1">
                  <li
                    *ngFor="
                      let suggestion of sqlResults.optimization.suggestions
                    "
                    class="text-yellow-600 dark:text-yellow-400"
                  >
                    {{ suggestion }}
                  </li>
                </ul>
              </div>

              <!-- Index Recommendations -->
              <div class="space-y-2">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                  Recommended Indexes
                </h3>
                <pre
                  *ngFor="
                    let index of sqlResults.optimization.indexRecommendations
                  "
                  class="bg-gray-50 dark:bg-gray-900 p-2 rounded-lg text-sm"
                  >{{ index }}</pre
                >
              </div>

              <!-- Sample Data -->
              <div *ngIf="sqlResults.sampleData" class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                  Sample Data
                </h3>

                <div *ngIf="sqlResults.sampleData.input" class="space-y-2">
                  <h4 class="font-medium text-gray-700 dark:text-gray-300">
                    Input Data
                  </h4>
                  <pre
                    class="bg-gray-50 dark:bg-gray-900 p-2 rounded-lg text-sm"
                    >{{ sqlResults.sampleData.input | json }}</pre
                  >
                </div>

                <div *ngIf="sqlResults.sampleData.output" class="space-y-2">
                  <h4 class="font-medium text-gray-700 dark:text-gray-300">
                    Expected Output
                  </h4>
                  <pre
                    class="bg-gray-50 dark:bg-gray-900 p-2 rounded-lg text-sm"
                    >{{ sqlResults.sampleData.output | json }}</pre
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Test Case Generator Tool -->
          <div *ngIf="selectedTool.id === 'test-generator'" class="space-y-4">
            <div class="flex flex-col space-y-2">
              <label class="text-gray-700 dark:text-gray-300"
                >Code to Test</label
              >
              <textarea
                [(ngModel)]="testGeneratorInput"
                rows="8"
                class="w-full p-2 border rounded-lg font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Paste your code here to generate tests..."
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  class="block text-sm text-gray-700 dark:text-gray-300 mb-1"
                  >Framework</label
                >
                <select
                  [(ngModel)]="testFramework"
                  class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="jest">Jest</option>
                  <option value="mocha">Mocha</option>
                  <option value="pytest">PyTest</option>
                  <option value="junit">JUnit</option>
                </select>
              </div>

              <div>
                <label
                  class="block text-sm text-gray-700 dark:text-gray-300 mb-1"
                  >Test Type</label
                >
                <select
                  [(ngModel)]="testType"
                  class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="unit">Unit Tests</option>
                  <option value="integration">Integration Tests</option>
                  <option value="e2e">End-to-End Tests</option>
                </select>
              </div>

              <div class="flex items-center">
                <label
                  class="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <input
                    type="checkbox"
                    [(ngModel)]="includeCoverage"
                    class="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span>Include Coverage Analysis</span>
                </label>
              </div>
            </div>

            <div class="flex justify-end">
              <button
                (click)="generateTests()"
                [disabled]="isProcessing"
                class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center space-x-2"
              >
                <span>{{
                  isProcessing ? 'Generating...' : 'Generate Tests'
                }}</span>
                <div
                  *ngIf="isProcessing"
                  class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                ></div>
              </button>
            </div>

            <!-- Test Results -->
            <div *ngIf="testResults" class="mt-6 space-y-6">
              <!-- Coverage Report -->
              <div
                *ngIf="testResults.coverage"
                class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg"
              >
                <h3
                  class="text-lg font-semibold text-green-600 dark:text-green-400 mb-4"
                >
                  Coverage Report
                </h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div
                    *ngFor="
                      let item of [
                        {
                          label: 'Statements',
                          value: testResults.coverage.statements
                        },
                        {
                          label: 'Branches',
                          value: testResults.coverage.branches
                        },
                        {
                          label: 'Functions',
                          value: testResults.coverage.functions
                        },
                        { label: 'Lines', value: testResults.coverage.lines }
                      ]
                    "
                    class="text-center"
                  >
                    <div
                      class="text-2xl font-bold text-green-600 dark:text-green-400"
                    >
                      {{ item.value }}%
                    </div>
                    <div class="text-sm text-green-600 dark:text-green-400">
                      {{ item.label }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Test Cases -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                  Test Cases
                </h3>
                <div class="space-y-4">
                  <div
                    *ngFor="let testCase of testResults.testCases"
                    class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-medium text-gray-800 dark:text-white">
                        {{ testCase.description }}
                      </h4>
                      <span
                        [class]="
                          'px-2 py-1 text-sm rounded-full ' +
                          (testCase.type === 'positive'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : testCase.type === 'negative'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200')
                        "
                      >
                        {{ testCase.type }}
                      </span>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div *ngIf="testCase.input" class="space-y-1">
                        <div
                          class="text-sm font-medium text-gray-600 dark:text-gray-400"
                        >
                          Input:
                        </div>
                        <pre
                          class="text-sm bg-gray-50 dark:bg-gray-900 p-2 rounded"
                          >{{ testCase.input | json }}</pre
                        >
                      </div>
                      <div *ngIf="testCase.expectedOutput" class="space-y-1">
                        <div
                          class="text-sm font-medium text-gray-600 dark:text-gray-400"
                        >
                          Expected Output:
                        </div>
                        <pre
                          class="text-sm bg-gray-50 dark:bg-gray-900 p-2 rounded"
                          >{{ testCase.expectedOutput | json }}</pre
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Generated Test Code -->
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <h3
                    class="text-lg font-semibold text-gray-800 dark:text-white"
                  >
                    Generated Test Code
                  </h3>
                  <button
                    (click)="copyToClipboard()"
                    class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Copy
                  </button>
                </div>
                <pre
                  class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto"
                  >{{ testResults.testCode }}</pre
                >
              </div>

              <!-- Mocks -->
              <div *ngIf="testResults.mocks?.length" class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                  Mock Implementations
                </h3>
                <div class="space-y-4">
                  <div *ngFor="let mock of testResults.mocks" class="space-y-2">
                    <h4 class="font-medium text-gray-700 dark:text-gray-300">
                      {{ mock.name }}
                    </h4>
                    <pre
                      class="bg-gray-50 dark:bg-gray-900 p-2 rounded-lg text-sm"
                      >{{ mock.code }}</pre
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- API Generator Tool -->
          <div *ngIf="selectedTool.id === 'api-generator'" class="space-y-4">
            <div class="flex flex-col space-y-2">
              <label class="text-gray-700 dark:text-gray-300"
                >Model Definition</label
              >
              <textarea
                [(ngModel)]="modelDefinition"
                rows="8"
                class="w-full p-2 border rounded-lg font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Define your data model here..."
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label
                  class="block text-sm text-gray-700 dark:text-gray-300 mb-1"
                  >Framework</label
                >
                <select
                  [(ngModel)]="selectedFramework"
                  class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="nestjs">NestJS</option>
                  <option value="express">Express</option>
                  <option value="fastapi">FastAPI</option>
                  <option value="django">Django</option>
                </select>
              </div>

              <div>
                <label
                  class="block text-sm text-gray-700 dark:text-gray-300 mb-1"
                  >Database</label
                >
                <select
                  [(ngModel)]="selectedDatabase"
                  class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="postgresql">PostgreSQL</option>
                  <option value="mongodb">MongoDB</option>
                  <option value="mysql">MySQL</option>
                </select>
              </div>

              <div>
                <label
                  class="block text-sm text-gray-700 dark:text-gray-300 mb-1"
                  >Features</label
                >
                <select
                  multiple
                  [(ngModel)]="selectedFeatures"
                  class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="crud">CRUD Operations</option>
                  <option value="validation">Data Validation</option>
                  <option value="swagger">Swagger Docs</option>
                  <option value="testing">Unit Tests</option>
                </select>
              </div>

              <div class="flex items-center">
                <label class="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    [(ngModel)]="enableAuth"
                    class="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span class="text-sm text-gray-700 dark:text-gray-300"
                    >Enable Authentication</span
                  >
                </label>
              </div>
            </div>

            <div class="flex justify-end">
              <button
                (click)="generateAPI()"
                [disabled]="isProcessing"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center space-x-2"
              >
                <span>{{
                  isProcessing ? 'Generating...' : 'Generate API'
                }}</span>
                <div
                  *ngIf="isProcessing"
                  class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                ></div>
              </button>
            </div>

            <!-- API Results -->
            <div *ngIf="apiResults" class="mt-6 space-y-6">
              <!-- Endpoints -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                  Generated Endpoints
                </h3>
                <div
                  *ngFor="let endpoint of apiResults.endpoints"
                  class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center space-x-2">
                      <span
                        class="px-2 py-1 text-sm rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                      >
                        {{ endpoint.method }}
                      </span>
                      <span
                        class="font-mono text-gray-800 dark:text-gray-200"
                        >{{ endpoint.path }}</span
                      >
                    </div>
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {{ endpoint.description }}
                  </p>
                  <pre
                    class="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-sm overflow-x-auto"
                    >{{ endpoint.code }}</pre
                  >
                </div>
              </div>

              <!-- Models -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                  Data Models
                </h3>
                <div *ngFor="let model of apiResults.models" class="space-y-2">
                  <h4 class="font-medium text-gray-700 dark:text-gray-300">
                    {{ model.name }}
                  </h4>
                  <pre
                    class="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-sm overflow-x-auto"
                    >{{ model.schema }}</pre
                  >
                </div>
              </div>

              <!-- Middleware -->
              <div *ngIf="apiResults.middleware.length" class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                  Middleware
                </h3>
                <div *ngFor="let mw of apiResults.middleware" class="space-y-2">
                  <div class="flex justify-between items-center">
                    <h4 class="font-medium text-gray-700 dark:text-gray-300">
                      {{ mw.name }}
                    </h4>
                    <span class="text-sm text-gray-500 dark:text-gray-400">{{
                      mw.purpose
                    }}</span>
                  </div>
                  <pre
                    class="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-sm overflow-x-auto"
                    >{{ mw.code }}</pre
                  >
                </div>
              </div>

              <!-- Documentation -->
              <div class="space-y-2">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                  API Documentation
                </h3>
                <div
                  class="prose dark:prose-invert max-w-none"
                  [innerHTML]="apiResults.documentation"
                ></div>
              </div>
            </div>
          </div>

          <!-- Code Review Tool -->
          <div *ngIf="selectedTool.id === 'code-review'" class="space-y-4">
            <div class="flex flex-col space-y-2">
              <label class="text-gray-700 dark:text-gray-300"
                >Code to Review</label
              >
              <textarea
                [(ngModel)]="codeToReview"
                rows="8"
                class="w-full p-2 border rounded-lg font-mono dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Paste your code here..."
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  class="block text-sm text-gray-700 dark:text-gray-300 mb-1"
                  >Review Level</label
                >
                <select
                  [(ngModel)]="reviewLevel"
                  class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="basic">Basic</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label
                  class="block text-sm text-gray-700 dark:text-gray-300 mb-1"
                  >Focus Areas</label
                >
                <select
                  multiple
                  [(ngModel)]="reviewFocus"
                  class="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="security">Security</option>
                  <option value="performance">Performance</option>
                  <option value="maintainability">Maintainability</option>
                  <option value="style">Code Style</option>
                </select>
              </div>
            </div>

            <div class="flex justify-end">
              <button
                (click)="reviewCode()"
                [disabled]="isProcessing"
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center space-x-2"
              >
                <span>{{ isProcessing ? 'Reviewing...' : 'Review Code' }}</span>
                <div
                  *ngIf="isProcessing"
                  class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                ></div>
              </button>
            </div>

            <!-- Review Results -->
            <div *ngIf="reviewResults" class="mt-6 space-y-6">
              <!-- Summary -->
              <div
                class="p-4 rounded-lg"
                [ngClass]="{
                  'bg-green-50 dark:bg-green-900':
                    reviewResults.summary.level === 'good',
                  'bg-yellow-50 dark:bg-yellow-900':
                    reviewResults.summary.level === 'warning',
                  'bg-red-50 dark:bg-red-900':
                    reviewResults.summary.level === 'critical'
                }"
              >
                <div class="flex items-center justify-between">
                  <h3
                    class="text-lg font-semibold"
                    [ngClass]="{
                      'text-green-800 dark:text-green-200':
                        reviewResults.summary.level === 'good',
                      'text-yellow-800 dark:text-yellow-200':
                        reviewResults.summary.level === 'warning',
                      'text-red-800 dark:text-red-200':
                        reviewResults.summary.level === 'critical'
                    }"
                  >
                    Code Review Score: {{ reviewResults.summary.score }}/100
                  </h3>
                  <span
                    class="px-2 py-1 text-sm rounded-full"
                    [ngClass]="{
                      'bg-green-200 text-green-800':
                        reviewResults.summary.level === 'good',
                      'bg-yellow-200 text-yellow-800':
                        reviewResults.summary.level === 'warning',
                      'bg-red-200 text-red-800':
                        reviewResults.summary.level === 'critical'
                    }"
                  >
                    {{ reviewResults.summary.level | titlecase }}
                  </span>
                </div>
                <p
                  class="mt-2 text-sm"
                  [ngClass]="{
                    'text-green-700 dark:text-green-300':
                      reviewResults.summary.level === 'good',
                    'text-yellow-700 dark:text-yellow-300':
                      reviewResults.summary.level === 'warning',
                    'text-red-700 dark:text-red-300':
                      reviewResults.summary.level === 'critical'
                  }"
                >
                  {{ reviewResults.summary.message }}
                </p>
              </div>

              <!-- Issues -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                  Issues Found
                </h3>
                <div
                  *ngFor="let issue of reviewResults.issues"
                  class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div class="flex items-center justify-between mb-2">
                    <span
                      class="px-2 py-1 text-sm rounded-full"
                      [ngClass]="{
                        'bg-red-100 text-red-800': issue.severity === 'high',
                        'bg-yellow-100 text-yellow-800':
                          issue.severity === 'medium',
                        'bg-blue-100 text-blue-800': issue.severity === 'low'
                      }"
                    >
                      {{ issue.type | titlecase }} -
                      {{ issue.severity | titlecase }}
                    </span>
                    <span class="text-sm text-gray-500"
                      >Line {{ issue.line }}</span
                    >
                  </div>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {{ issue.message }}
                  </p>
                  <div class="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                    <p
                      class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Suggestion:
                    </p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ issue.suggestion }}
                    </p>
                    <pre
                      *ngIf="issue.codeExample"
                      class="mt-2 text-sm overflow-x-auto"
                      >{{ issue.codeExample }}</pre
                    >
                  </div>
                </div>
              </div>

              <!-- Improvements -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                  Suggested Improvements
                </h3>
                <div
                  *ngFor="let improvement of reviewResults.improvements"
                  class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <h4 class="font-medium text-gray-800 dark:text-white mb-2">
                    {{ improvement.title }}
                  </h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {{ improvement.description }}
                  </p>
                  <pre
                    *ngIf="improvement.diff"
                    class="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-sm overflow-x-auto"
                    >{{ improvement.diff }}</pre
                  >
                </div>
              </div>

              <!-- Best Practices -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 dark:text-white">
                  Best Practices
                </h3>
                <div
                  *ngFor="let practice of reviewResults.bestPractices"
                  class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <h4 class="font-medium text-gray-800 dark:text-white mb-2">
                    {{ practice.title }}
                  </h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {{ practice.description }}
                  </p>
                  <a
                    *ngIf="practice.reference"
                    [href]="practice.reference"
                    target="_blank"
                    class="text-sm text-blue-500 hover:underline mt-2 inline-block"
                  >
                    Learn more
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .bg-grid-pattern {
        background-image: radial-gradient(circle, #4a90e2 1px, transparent 1px);
        background-size: 30px 30px;
      }

      @keyframes gradient {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }

      .animate-gradient {
        background-size: 400% 400%;
        animation: gradient 15s ease infinite;
      }
    `,
  ],
})
export class AIToolsPageComponent implements OnInit {
  tools: AITool[] = [];
  selectedTool!: AITool;
  selectedLanguage: string = 'javascript';
  isProcessing: boolean = false;

  // Code Generator properties
  codeDescription: string = '';
  generatedCode: string = '';

  // Code Debugger properties
  codeToDebug: string = '';
  debugResults: { errors: string[]; suggestions: string[] } | null = null;

  // Code Optimizer properties
  codeToOptimize: string = '';
  optimizationResults: {
    optimizedCode: string;
    improvements: string[];
    performanceGain: string;
  } | null = null;

  // Code Explainer properties
  codeToExplain: string = '';
  explanationResults: {
    commentedCode: string;
    explanation: {
      overview: string;
      complexity: string;
      keyPoints: string[];
    };
  } | null = null;

  // Code Translator properties
  codeToTranslate: string = '';
  fromLanguage: string = 'javascript';
  toLanguage: string = 'python';
  translationResults: {
    translatedCode: string;
    notes: string[];
    compatibility: {
      level: 'high' | 'medium' | 'low';
      issues: string[];
    };
  } | null = null;

  // Documentation Generator properties
  docGeneratorInput: string = '';
  docType: 'readme' | 'api' | 'jsdoc' = 'readme';
  projectName: string = '';
  docResults: {
    documentation: string;
    sections: { title: string; content: string }[];
    metadata: {
      dependencies?: string[];
      apiEndpoints?: string[];
      examples?: string[];
    };
  } | null = null;

  // Regex Generator properties
  regexDescription: string = '';
  regexFlags: string = '';
  testInput: string = '';
  regexResults: {
    pattern: string;
    explanation: string[];
    testResults: {
      input: string;
      matches: boolean;
      groups?: string[];
    }[];
    examples: string[];
  } | null = null;

  // SQL Query Builder properties
  queryDescription: string = '';
  dbType: 'mysql' | 'postgresql' | 'sqlite' = 'postgresql';
  queryType: 'select' | 'insert' | 'update' | 'delete' = 'select';
  tables: string = '';
  sqlResults: {
    query: string;
    explanation: string;
    optimization: {
      suggestions: string[];
      indexRecommendations: string[];
    };
    sampleData?: {
      input?: any;
      output?: any;
    };
  } | null = null;

  // Test Case Generator properties
  testGeneratorInput: string = '';
  testFramework: 'jest' | 'mocha' | 'pytest' | 'junit' = 'jest';
  testType: 'unit' | 'integration' | 'e2e' = 'unit';
  includeCoverage: boolean = true;
  testResults: {
    testCode: string;
    coverage: {
      statements: number;
      branches: number;
      functions: number;
      lines: number;
    };
    testCases: {
      description: string;
      input?: any;
      expectedOutput?: any;
      type: 'positive' | 'negative' | 'edge';
    }[];
    mocks?: {
      name: string;
      code: string;
    }[];
  } | null = null;

  // Add these properties
  modelDefinition: string = '';
  selectedFramework: 'express' | 'nestjs' | 'fastapi' | 'django' = 'nestjs';
  selectedFeatures: string[] = ['crud', 'auth', 'validation'];
  selectedDatabase: 'mongodb' | 'postgresql' | 'mysql' = 'postgresql';
  enableAuth: boolean = true;
  apiResults: {
    endpoints: Array<{
      path: string;
      method: string;
      description: string;
      code: string;
      params?: any;
      response?: any;
    }>;
    models: Array<{
      name: string;
      schema: string;
    }>;
    middleware: Array<{
      name: string;
      code: string;
      purpose: string;
    }>;
    documentation: string;
  } | null = null;

  // Add these properties
  codeToReview: string = '';
  reviewLevel: 'basic' | 'intermediate' | 'advanced' = 'intermediate';
  reviewFocus: ('security' | 'performance' | 'maintainability' | 'style')[] = [
    'security',
    'performance',
  ];
  reviewResults: {
    summary: {
      score: number;
      level: 'good' | 'warning' | 'critical';
      message: string;
    };
    issues: Array<{
      type: 'security' | 'performance' | 'maintainability' | 'style';
      severity: 'low' | 'medium' | 'high';
      line: number;
      message: string;
      suggestion: string;
      codeExample?: string;
    }>;
    improvements: Array<{
      title: string;
      description: string;
      diff?: string;
    }>;
    bestPractices: Array<{
      title: string;
      description: string;
      reference?: string;
    }>;
  } | null = null;

  constructor(
    private aiToolsService: AIToolsService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.tools = this.aiToolsService.getTools();
  }

  onToolSelect(tool: AITool) {
    this.selectedTool = tool;
  }

  selectTool(tool: AITool) {
    this.selectedTool = tool;
    this.tools.forEach((t) => (t.isActive = false));
    tool.isActive = true;
    this.resetState();
  }

  async generateCode() {
    if (!this.codeDescription) {
      this.toastr.warning(
        'Please provide a detailed description of the code you want to generate'
      );
      return;
    }

    this.isProcessing = true;
    try {
      // Add input validation
      if (this.codeDescription.length < 10) {
        throw new Error('Description too short. Please provide more details.');
      }

      // Add retry logic and better error handling
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          this.generatedCode = await this.aiToolsService.generateCode(
            this.codeDescription,
            this.selectedLanguage
          );

          // Validate the generated code
          if (!this.generatedCode || this.generatedCode.trim().length === 0) {
            throw new Error('Generated code is empty');
          }

          this.toastr.success('Code generated successfully');
          break;
        } catch (error) {
          attempts++;
          if (attempts === maxAttempts) {
            throw error;
          }
          // Wait before retrying
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    } catch (error) {
      this.generatedCode = '';
      this.toastr.error(
        error instanceof Error
          ? error.message
          : 'Failed to generate code. Please try again.'
      );
      console.error('Generation error:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  async debugCode() {
    if (!this.codeToDebug) {
      this.toastr.warning('Please enter code to debug');
      return;
    }

    this.isProcessing = true;
    try {
      // Validate input code
      if (this.codeToDebug.trim().length < 5) {
        throw new Error('Please provide valid code to debug');
      }

      const results = await this.aiToolsService.debugCode(
        this.codeToDebug,
        this.selectedLanguage
      );

      // Validate results
      if (!results || (!results.errors && !results.suggestions)) {
        throw new Error('Invalid debug results received');
      }

      this.debugResults = {
        errors: results.errors || [],
        suggestions: results.suggestions || [],
      };

      if (
        this.debugResults.errors.length === 0 &&
        this.debugResults.suggestions.length === 0
      ) {
        this.toastr.info('No issues found in the code');
      } else {
        this.toastr.success('Code analysis complete');
      }
    } catch (error) {
      this.debugResults = null;
      this.toastr.error(
        error instanceof Error ? error.message : 'Error analyzing code'
      );
      console.error('Debug error:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  async copyToClipboard() {
    try {
      await navigator.clipboard.writeText(this.generatedCode);
      this.toastr.success('Code copied to clipboard');
    } catch (error) {
      this.toastr.error('Failed to copy code');
    }
  }

  async optimizeCode() {
    if (!this.codeToOptimize) {
      this.toastr.warning('Please enter code to optimize');
      return;
    }

    this.isProcessing = true;
    try {
      // Validate input code
      if (this.codeToOptimize.trim().length < 5) {
        throw new Error('Please provide valid code to optimize');
      }

      const results = await this.aiToolsService.optimizeCode(
        this.codeToOptimize,
        this.selectedLanguage
      );

      // Validate optimization results
      if (!results || !results.optimizedCode) {
        throw new Error('Invalid optimization results received');
      }

      this.optimizationResults = {
        optimizedCode: results.optimizedCode,
        improvements: results.improvements || [],
        performanceGain:
          results.performanceGain || 'No significant improvement',
      };

      this.toastr.success('Code optimization complete');
    } catch (error) {
      this.optimizationResults = null;
      this.toastr.error(
        error instanceof Error ? error.message : 'Error optimizing code'
      );
      console.error('Optimization error:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  async explainCode() {
    if (!this.codeToExplain) {
      this.toastr.warning('Please enter code to explain');
      return;
    }

    this.isProcessing = true;
    try {
      this.explanationResults = await this.aiToolsService.explainCode(
        this.codeToExplain,
        this.selectedLanguage
      );
      this.toastr.success('Code explanation generated');
    } catch (error) {
      this.toastr.error('Error explaining code');
      console.error('Explanation error:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  async translateCode() {
    if (!this.codeToTranslate) {
      this.toastr.warning('Please enter code to translate');
      return;
    }

    if (this.fromLanguage === this.toLanguage) {
      this.toastr.warning('Please select different languages for translation');
      return;
    }

    this.isProcessing = true;
    try {
      this.translationResults = await this.aiToolsService.translateCode(
        this.codeToTranslate,
        this.fromLanguage,
        this.toLanguage
      );
      this.toastr.success('Code translation complete');
    } catch (error) {
      this.toastr.error('Error translating code');
      console.error('Translation error:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  async generateDocumentation() {
    if (!this.docGeneratorInput) {
      this.toastr.warning('Please enter code or project details');
      return;
    }

    this.isProcessing = true;
    try {
      this.docResults = await this.aiToolsService.generateDocumentation(
        this.docGeneratorInput,
        {
          type: this.docType,
          projectName: this.projectName,
          language: this.selectedLanguage,
        }
      );
      this.toastr.success('Documentation generated successfully');
    } catch (error) {
      this.toastr.error('Error generating documentation');
      console.error('Documentation error:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  async generateRegex() {
    if (!this.regexDescription) {
      this.toastr.warning('Please enter a description for the regex pattern');
      return;
    }

    this.isProcessing = true;
    try {
      this.regexResults = await this.aiToolsService.generateRegex(
        this.regexDescription,
        {
          flags: this.regexFlags,
          testCases: this.testInput ? [this.testInput] : undefined,
        }
      );
      this.toastr.success('Regex pattern generated successfully');
    } catch (error) {
      this.toastr.error('Error generating regex pattern');
      console.error('Regex error:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  testRegex(input: string): boolean {
    if (!this.regexResults) return false;
    try {
      const regex = new RegExp(this.regexResults.pattern, this.regexFlags);
      return regex.test(input);
    } catch {
      return false;
    }
  }

  async generateSQLQuery() {
    if (!this.queryDescription) {
      this.toastr.warning('Please enter a query description');
      return;
    }

    this.isProcessing = true;
    try {
      this.sqlResults = await this.aiToolsService.generateSQLQuery(
        this.queryDescription,
        {
          dbType: this.dbType,
          queryType: this.queryType,
          tables: this.tables
            .split(',')
            .map((t) => t.trim())
            .filter((t) => t),
        }
      );
      this.toastr.success('SQL query generated successfully');
    } catch (error) {
      this.toastr.error('Error generating SQL query');
      console.error('SQL generation error:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  async generateTests() {
    if (!this.testGeneratorInput) {
      this.toastr.warning('Please enter code to generate tests for');
      return;
    }

    this.isProcessing = true;
    try {
      this.testResults = await this.aiToolsService.generateTests(
        this.testGeneratorInput,
        {
          framework: this.testFramework,
          type: this.testType,
          coverage: this.includeCoverage,
        }
      );
      this.toastr.success('Test cases generated successfully');
    } catch (error) {
      this.toastr.error('Error generating test cases');
      console.error('Test generation error:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  handleAction(action: { type: string; label: string; data?: any }) {
    switch (action.type) {
      case 'copy':
        navigator.clipboard.writeText(action.data?.code || '');
        this.toastr.success('Code copied to clipboard');
        break;
      case 'run':
      case 'test':
      case 'debug':
        this.toastr.info(`${action.type} action triggered`);
        break;
    }
  }

  private resetState() {
    this.codeDescription = '';
    this.generatedCode = '';
    this.codeToDebug = '';
    this.debugResults = null;
    this.isProcessing = false;
    this.codeToOptimize = '';
    this.optimizationResults = null;
    this.codeToExplain = '';
    this.explanationResults = null;
    this.codeToTranslate = '';
    this.translationResults = null;
    this.docGeneratorInput = '';
    this.docResults = null;
    this.regexDescription = '';
    this.regexResults = null;
    this.testInput = '';
    this.queryDescription = '';
    this.sqlResults = null;
    this.testGeneratorInput = '';
    this.testResults = null;
    this.modelDefinition = '';
    this.apiResults = null;
    this.codeToReview = '';
    this.reviewResults = null;
  }

  getCompatibilityColor(level: 'high' | 'medium' | 'low'): string {
    const colors = {
      high: 'text-green-600 dark:text-green-400',
      medium: 'text-yellow-600 dark:text-yellow-400',
      low: 'text-red-600 dark:text-red-400',
    };
    return colors[level];
  }

  async generateAPI() {
    if (!this.modelDefinition) {
      this.toastr.warning('Please enter model definition');
      return;
    }

    this.isProcessing = true;
    try {
      this.apiResults = await this.aiToolsService.generateAPI(
        this.modelDefinition,
        {
          framework: this.selectedFramework,
          features: this.selectedFeatures,
          auth: this.enableAuth,
          database: this.selectedDatabase,
        }
      );
      this.toastr.success('API generated successfully');
    } catch (error) {
      this.toastr.error('Error generating API');
      console.error('API generation error:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  async reviewCode() {
    if (!this.codeToReview) {
      this.toastr.warning('Please enter code to review');
      return;
    }

    this.isProcessing = true;
    try {
      this.reviewResults = await this.aiToolsService['reviewCode'](
        this.codeToReview,
        {
          language: this.selectedLanguage,
          level: this.reviewLevel,
          focus: this.reviewFocus,
        }
      );
      this.toastr.success('Code review completed');
    } catch (error) {
      this.toastr.error('Error reviewing code');
      console.error('Code review error:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  getCategoryClass(category: string): string {
    switch (category) {
      case 'code-assistance':
        return 'category-badge-code';
      case 'productivity':
        return 'category-badge-productivity';
      case 'learning':
        return 'category-badge-learning';
      default:
        return '';
    }
  }

  // Add a method to validate language selection
  private validateLanguage(language: string): boolean {
    const supportedLanguages = ['javascript', 'typescript', 'python', 'java'];
    if (!supportedLanguages.includes(language)) {
      this.toastr.error(`Language ${language} is not supported`);
      return false;
    }
    return true;
  }

  // Add a method to sanitize code input
  private sanitizeCode(code: string): string {
    // Remove potentially harmful characters or patterns
    return code
      .trim()
      .replace(/[^\x20-\x7E\n\t]/g, '') // Remove non-printable characters
      .replace(/`/g, '\\`'); // Escape backticks
  }

  // Add these properties for better error handling
  private readonly errorMessages = {
    emptyInput: 'Please provide input before proceeding',
    invalidLanguage: 'Selected language is not supported',
    processingError: 'An error occurred while processing your request',
    networkError: 'Network error. Please check your connection and try again',
    timeoutError: 'Request timed out. Please try again',
  };
}
