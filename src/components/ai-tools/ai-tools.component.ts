import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AIService } from '../../app/services/ai.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ai-tools',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Toggle Button -->
    <button
      (click)="togglePanel($event)"
      class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2 mb-4"
    >
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9.663 17h4.673M12 3c-1.023 0-2.047.394-2.817 1.164A3.993 3.993 0 008 7v4c0 .552-.448 1-1 1s-1 .448-1 1v1a1 1 0 001 1h10a1 1 0 001-1v-1c0-.552-.448-1-1-1s-1-.448-1-1V7c0-1.023-.394-2.047-1.164-2.817A3.993 3.993 0 0012 3z"
        />
      </svg>
      <span>AI Assistant</span>
      <svg
        class="w-4 h-4 transition-transform duration-200"
        [class.rotate-180]="isOpen"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <!-- AI Tools Panel -->
    <div
      class="overflow-hidden transition-all duration-300 ease-in-out"
      [class.max-h-0]="!isOpen"
      [class.max-h-[1000px]]="isOpen"
    >
      <div
        class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 transition-all duration-200"
      >
        <div class="space-y-4">
          <!-- AI Tools Content -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Generate Code -->
            <div class="space-y-2">
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Generate Code
              </label>
              <div class="flex space-x-2">
                <input
                  type="text"
                  [(ngModel)]="promptText"
                  class="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
                  placeholder="Describe what you want to create..."
                />
                <button
                  (click)="generateCode()"
                  class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-all duration-200"
                >
                  Generate
                </button>
              </div>
            </div>

            <!-- AI Actions -->
            <div class="flex space-x-2">
              <button
                type="button"
                (click)="explainCode()"
                [disabled]="!code || (aiService.isProcessing$ | async)"
                class="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <span>Explain Code</span>
                <div
                  *ngIf="aiService.isProcessing$ | async"
                  class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                ></div>
              </button>
              <button
                type="button"
                (click)="improveCode()"
                [disabled]="!code || (aiService.isProcessing$ | async)"
                class="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                <span>Suggest Improvements</span>
                <div
                  *ngIf="aiService.isProcessing$ | async"
                  class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                ></div>
              </button>
            </div>

            <!-- Language Translation -->
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Translate To:
              </label>
              <div class="mt-1 flex space-x-2">
                <select
                  [(ngModel)]="targetLanguage"
                  [ngModelOptions]="{ standalone: true }"
                  class="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="java">Java</option>
                </select>
                <button
                  type="button"
                  (click)="translateCode()"
                  [disabled]="!code || (aiService.isProcessing$ | async)"
                  class="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  <span>Translate</span>
                  <div
                    *ngIf="aiService.isProcessing$ | async"
                    class="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  ></div>
                </button>
              </div>
            </div>
          </div>

          <!-- AI Response -->
          <div
            *ngIf="aiResponse"
            class="mt-4 bg-white dark:bg-gray-900 rounded-lg p-4 transition-all duration-200"
          >
            <div
              class="absolute top-0 left-0 h-1 bg-blue-500"
              [style.width.%]="typingProgress"
            ></div>

            <!-- Action Buttons -->
            <div class="flex justify-end space-x-2 mb-2">
              <button
                (click)="copyToClipboard()"
                class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center space-x-1"
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
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
                <span>Copy</span>
              </button>
              <button
                (click)="applyToCodeBin()"
                class="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 flex items-center space-x-1"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Apply to SnipAI </span>
              </button>
            </div>

            <pre
              class="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200"
              >{{ displayedResponse }}</pre
            >
            <div
              *ngIf="isTyping"
              class="inline-block w-2 h-4 bg-blue-500 animate-pulse"
            ></div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AIToolsComponent {
  @Input() code: string = '';
  @Output() applyCode = new EventEmitter<string>();
  isOpen = false;
  promptText = '';
  targetLanguage = 'python';
  aiResponse: string | null = null;
  displayedResponse = '';
  isTyping = false;
  typingProgress = 0;

  constructor(public aiService: AIService, private toastr: ToastrService) {}

  togglePanel(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  private async simulateTyping(text: string) {
    this.isTyping = true;
    this.displayedResponse = '';
    const characters = text.split('');
    const totalChars = characters.length;

    for (let i = 0; i < characters.length; i++) {
      this.displayedResponse += characters[i];
      this.typingProgress = (i / totalChars) * 100;
      await new Promise((resolve) => setTimeout(resolve, 10)); // Adjust speed here
    }

    this.typingProgress = 100;
    this.isTyping = false;
  }

  async generateCode() {
    if (!this.promptText) return;
    try {
      const response = await this.aiService.generateCodeFromPrompt(
        this.promptText,
        'javascript'
      );
      this.aiResponse = response;
      await this.simulateTyping(response);
    } catch (error) {
      this.toastr.error('Error generating code');
    }
  }

  async explainCode() {
    if (!this.code) return;
    try {
      const response = await this.aiService.explainCode(this.code);
      this.aiResponse = response;
      await this.simulateTyping(response);
    } catch (error) {
      this.toastr.error('Error explaining code');
    }
  }

  async improveCode() {
    if (!this.code) return;
    try {
      const response = await this.aiService.suggestImprovements(this.code);
      this.aiResponse = response;
      await this.simulateTyping(response);
    } catch (error) {
      this.toastr.error('Error suggesting improvements');
    }
  }

  async translateCode() {
    if (!this.code) return;
    try {
      const response = await this.aiService.translateCode(
        this.code,
        'javascript',
        this.targetLanguage
      );
      this.aiResponse = response;
      await this.simulateTyping(response);
    } catch (error) {
      this.toastr.error('Error translating code');
    }
  }

  async copyToClipboard() {
    try {
      await navigator.clipboard.writeText(this.displayedResponse);
      this.toastr.success('Code copied to clipboard');
    } catch (error) {
      this.toastr.error('Failed to copy code');
    }
  }

  applyToCodeBin() {
    this.applyCode.emit(this.displayedResponse);
    this.toastr.success('Code applied to editor');
  }
}
