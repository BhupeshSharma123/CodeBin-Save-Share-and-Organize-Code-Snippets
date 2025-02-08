import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AIService } from '../../app/services/ai.service';
import { ToastrService } from 'ngx-toastr';

// Remove the default import
// import Prism from 'prismjs';

// Add this instead
declare const Prism: any;
import 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-java';
import { AITool } from '../../interfaces/ai-tool.interface';
import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';

@Component({
  selector: 'app-ai-tools',
  standalone: true,
  imports: [CommonModule, FormsModule],
  animations: [
    trigger('cardHover', [
      state(
        'initial',
        style({
          transform: 'scale(1)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        })
      ),
      state(
        'hovered',
        style({
          transform: 'scale(1.02)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        })
      ),
      transition('initial <=> hovered', animate('200ms ease-in-out')),
    ]),
    trigger('iconPulse', [
      state('initial', style({ transform: 'scale(1)' })),
      state('active', style({ transform: 'scale(1.1)' })),
      transition('initial <=> active', animate('300ms ease-in-out')),
    ]),
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
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

            <!-- Inside the Generate Code section -->
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
              <button
                (click)="clearInput()"
                class="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-500 transition-all duration-200"
              >
                Clear
              </button>
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
              <button
                (click)="clearResponse()"
                class="px-3 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800 flex items-center space-x-1"
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
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                <span>Clear</span>
              </button>
              <button
                (click)="executeCode()"
                [disabled]="isExecuting"
                class="px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-200 dark:hover:bg-purple-800 flex items-center space-x-1"
              >
                <div
                  *ngIf="isExecuting"
                  class="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                ></div>
                <svg
                  *ngIf="!isExecuting"
                  class="w-4 h-4"
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
                <span>{{ isExecuting ? 'Running...' : 'Run Code' }}</span>
              </button>
              <button
                (click)="downloadCode()"
                class="px-3 py-1 text-sm bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded hover:bg-indigo-200 dark:hover:bg-indigo-800 flex items-center space-x-1"
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span>Download</span>
              </button>
              <button
                (click)="loadTemplate()"
                class="px-3 py-1 text-sm bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 rounded hover:bg-teal-200 dark:hover:bg-teal-800 flex items-center space-x-1"
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
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>Load Template</span>
              </button>
            </div>

            <!-- Code Display with Syntax Highlighting -->
            <pre
              class="code-display whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 p-4 rounded bg-gray-50 dark:bg-gray-800 overflow-x-auto"
            ></pre>

            <div
              *ngIf="isTyping"
              class="inline-block w-2 h-4 bg-blue-500 animate-pulse"
            ></div>
          </div>
        </div>
      </div>
      <!-- Add a new section for History -->
      <div class="mt-6">
        <h3 class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          History
        </h3>
        <div class="space-y-2">
          <div
            *ngFor="let snippet of history"
            class="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
            (click)="loadSnippet(snippet)"
          >
            <pre class="text-sm text-gray-700 dark:text-gray-300">{{
              snippet
            }}</pre>
          </div>
        </div>
      </div>

      <!-- Code Output Section -->
      <div
        *ngIf="codeOutput"
        class="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
      >
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Output:
        </h4>
        <pre
          class="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200"
          >{{ codeOutput }}</pre
        >
      </div>
    </div>
  `,
})
export class AIToolsComponent {
  @Input() code: string = '';
  @Input() tools: (AITool & { isHovered?: boolean })[] = [];
  @Output() applyCode = new EventEmitter<string>();
  @Output() toolSelected = new EventEmitter<AITool>();
  isOpen = false;
  promptText = '';
  targetLanguage = 'python';
  aiResponse: string | null = null;
  displayedResponse = '';
  isTyping = false;
  typingProgress = 0;
  codeOutput: string = '';
  isExecuting: boolean = false;

  codeTemplates = {
    python: `def main():
    print("Hello World!")

if __name__ == "__main__":
    main()`,
    javascript: `function main() {
    console.log("Hello World!");
}

main();`,
    typescript: `function main(): void {
    console.log("Hello World!");
}

main();`,
    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}`,
  };

  constructor(public aiService: AIService, private toastr: ToastrService) {}

  togglePanel(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }
  characterCount = 0;
  clearInput() {
    this.promptText = '';
    this.characterCount = 0;
  }
  history: string[] = [];

  loadSnippet(snippet: string) {
    this.displayedResponse = snippet;
  }

  ngOnInit() {
    const savedCode = localStorage.getItem('savedCode');
    if (savedCode) {
      this.history.push(savedCode);
    }
  }
  updateCharacterCount() {
    this.characterCount = this.promptText.length;
  }

  private async simulateTyping(text: string) {
    this.isTyping = true;
    this.displayedResponse = '';
    const characters = text.split('');
    const totalChars = characters.length;

    for (let i = 0; i < characters.length; i++) {
      this.displayedResponse += characters[i];
      this.typingProgress = (i / totalChars) * 100;
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    this.typingProgress = 100;
    this.isTyping = false;
    this.highlightCode();
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
  clearResponse() {
    this.aiResponse = null;
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

  async executeCode() {
    if (!this.displayedResponse) return;

    this.isExecuting = true;
    this.codeOutput = '';

    try {
      // Create a safe console.log replacement
      const logs: string[] = [];
      const safeConsole = {
        log: (...args: any[]) => {
          logs.push(args.map((arg) => String(arg)).join(' '));
        },
        error: (...args: any[]) => {
          logs.push('Error: ' + args.map((arg) => String(arg)).join(' '));
        },
        warn: (...args: any[]) => {
          logs.push('Warning: ' + args.map((arg) => String(arg)).join(' '));
        },
      };

      if (this.targetLanguage === 'javascript') {
        // Create a safe execution context
        const code = `
          try {
            ${this.displayedResponse}
          } catch (error) {
            console.error(error);
          }
        `;

        // Execute the code with the safe console
        const executeFunction = new Function('console', code);
        executeFunction(safeConsole);

        // Display the output
        if (logs.length > 0) {
          this.codeOutput = logs.join('\n');
          this.aiResponse = `Code Output:\n${this.codeOutput}`;
          await this.simulateTyping(this.aiResponse);
        } else {
          this.aiResponse = 'Code executed successfully (no output)';
          await this.simulateTyping(this.aiResponse);
        }
      } else {
        this.toastr.info(
          'Code execution is currently only supported for JavaScript'
        );
      }
    } catch (error: any) {
      this.toastr.error('Error executing code: ' + error.message);
      this.aiResponse = `Error executing code:\n${error.message}`;
      await this.simulateTyping(this.aiResponse);
    } finally {
      this.isExecuting = false;
    }
  }

  loadTemplate() {
    const template =
      this.codeTemplates[
        this.targetLanguage as keyof typeof this.codeTemplates
      ];
    if (template) {
      this.displayedResponse = template;
      this.aiResponse = template;
      this.highlightCode();
    }
  }

  downloadCode() {
    if (!this.displayedResponse) return;

    const fileExtensions = {
      python: '.py',
      javascript: '.js',
      typescript: '.ts',
      java: '.java',
    };

    const extension =
      fileExtensions[this.targetLanguage as keyof typeof fileExtensions] ||
      '.txt';
    const blob = new Blob([this.displayedResponse], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code-snippet${extension}`;
    a.click();

    window.URL.revokeObjectURL(url);
  }

  highlightCode() {
    if (this.displayedResponse) {
      const highlighted = Prism.highlight(
        this.displayedResponse,
        Prism.languages[this.targetLanguage],
        this.targetLanguage
      );
      // Update the pre element with highlighted code
      const preElement = document.querySelector('.code-display');
      if (preElement) {
        preElement.innerHTML = highlighted;
      }
    }
  }

  selectTool(tool: AITool) {
    this.tools.forEach((t) => (t.isActive = false));
    tool.isActive = true;
    this.toolSelected.emit(tool);
  }
}
