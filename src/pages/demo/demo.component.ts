import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AIToolsComponent } from '../../components/ai-tools/ai-tools.component';
import { AIService } from '../../app/services/ai.service';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, AIToolsComponent],
  providers: [AIService],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div class="responsive-container">
        <!-- Demo Header -->
        <div class="text-center mb-12">
          <h1 class="responsive-heading text-gray-900 dark:text-white mb-4">
            Try SnipAI Demo
          </h1>
          <p
            class="responsive-text text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Experience the power of AI-assisted coding without signing up. Try
            these demo features below.
          </p>
        </div>

        <!-- Demo Features -->
        <div class="responsive-grid mb-12">
          <!-- Code Generation -->
          <div class="responsive-card">
            <h2 class="text-xl font-semibold mb-4">AI Code Generation</h2>
            <div class="space-y-4">
              <select
                [(ngModel)]="demoLanguage"
                class="w-full p-2 rounded border"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="typescript">TypeScript</option>
              </select>
              <textarea
                [(ngModel)]="demoPrompt"
                rows="4"
                placeholder="Describe the code you want to generate..."
                class="w-full p-2 rounded border"
              ></textarea>
              <button
                (click)="generateDemoCode()"
                [disabled]="isGenerating"
                class="responsive-button bg-blue-600 text-white w-full"
              >
                {{ isGenerating ? 'Generating...' : 'Generate Code' }}
              </button>
            </div>
          </div>

          <!-- Code Explanation -->
          <div class="responsive-card">
            <h2 class="text-xl font-semibold mb-4">Code Explanation</h2>
            <div class="space-y-4">
              <textarea
                [(ngModel)]="codeToExplain"
                rows="4"
                placeholder="Paste code to explain..."
                class="w-full p-2 rounded border"
              ></textarea>
              <button
                (click)="explainCode()"
                [disabled]="isExplaining"
                class="responsive-button bg-green-600 text-white w-full"
              >
                Explain Code
              </button>
            </div>
          </div>

          <!-- Code Optimization -->
          <div class="responsive-card">
            <h2 class="text-xl font-semibold mb-4">Code Optimization</h2>
            <div class="space-y-4">
              <textarea
                [(ngModel)]="codeToOptimize"
                rows="4"
                placeholder="Paste code to optimize..."
                class="w-full p-2 rounded border"
              ></textarea>
              <button
                (click)="optimizeCode()"
                [disabled]="isOptimizing"
                class="responsive-button bg-purple-600 text-white w-full"
              >
                Optimize Code
              </button>
            </div>
          </div>
        </div>

        <!-- Result Display -->
        <div *ngIf="demoResult" class="responsive-card">
          <h3 class="text-lg font-semibold mb-2">Result</h3>
          <pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto">
            <code>{{ demoResult }}</code>
          </pre>
        </div>

        <!-- Call to Action -->
        <div class="text-center mt-12">
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            Ready to unlock full features?
          </p>
          <button
            routerLink="/signup"
            class="responsive-button bg-blue-600 text-white"
          >
            Create Free Account
          </button>
        </div>
      </div>
    </div>
  `,
})
export class DemoComponent implements OnInit {
  demoLanguage = 'javascript';
  demoPrompt = '';
  codeToExplain = '';
  codeToOptimize = '';
  demoResult = '';
  isGenerating = false;
  isExplaining = false;
  isOptimizing = false;

  constructor(private aiService: AIService) {}

  ngOnInit() {
    // Load demo examples
    this.loadDemoExamples();
  }

  async generateDemoCode() {
    this.isGenerating = true;
    try {
      const result = await this.aiService.generateCode(
        this.demoPrompt,
        this.demoLanguage
      );
      this.demoResult = result;
    } catch (error) {
      this.demoResult = 'Error generating code. Please try again.';
    } finally {
      this.isGenerating = false;
    }
  }

  async explainCode() {
    this.isExplaining = true;
    try {
      const result = await this.aiService.explainCode(this.codeToExplain);
      this.demoResult = result;
    } catch (error) {
      this.demoResult = 'Error explaining code. Please try again.';
    } finally {
      this.isExplaining = false;
    }
  }

  async optimizeCode() {
    this.isOptimizing = true;
    try {
      const result = await this.aiService['optimizeCode'](this.codeToOptimize);
      this.demoResult = result;
    } catch (error) {
      this.demoResult = 'Error optimizing code. Please try again.';
    } finally {
      this.isOptimizing = false;
    }
  }

  private loadDemoExamples() {
    this.demoPrompt = 'Create a function to calculate fibonacci sequence';
    this.codeToExplain = `
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[0];
  const left = arr.slice(1).filter(x => x < pivot);
  const right = arr.slice(1).filter(x => x >= pivot);
  return [...quickSort(left), pivot, ...quickSort(right)];
}`;
    this.codeToOptimize = `
function findDuplicates(array) {
  let duplicates = [];
  for(let i = 0; i < array.length; i++) {
    for(let j = i + 1; j < array.length; j++) {
      if(array[i] === array[j] && !duplicates.includes(array[i])) {
        duplicates.push(array[i]);
      }
    }
  }
  return duplicates;
}`;
  }
}
