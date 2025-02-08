import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AIService } from '../../app/services/ai.service';
import { ToastrService } from 'ngx-toastr';
import {
  TemplatesService,
  CodeTemplate,
} from '../../app/services/templates.service';
import { SnipAI } from '../../app/services/supabase.service';
import { SupabaseService } from '../../app/services/supabase.service';
import { Router } from '@angular/router';

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
    <div class="responsive-container p-4">
      <!-- AI Assistant Panel -->
      <div class="mb-8">
        <button
          (click)="togglePanel($event)"
          class="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
        >
          <span>AI Assistant</span>
          <svg
            class="w-4 h-4 transition-transform duration-200"
            [class.rotate-180]="isPanelOpen"
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

        <div
          *ngIf="isPanelOpen"
          class="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
        >
          <div data-tour="ai-assistant">
            <textarea
              [(ngModel)]="userInput"
              rows="4"
              placeholder="Ask me anything about coding..."
              class="w-full p-3 rounded-lg border dark:border-gray-600 dark:bg-gray-700 mb-4"
            ></textarea>

            <div class="flex gap-4 mb-4">
              <select
                [(ngModel)]="targetLanguage"
                class="px-3 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
              </select>

              <button
                (click)="generateResponse()"
                [disabled]="isGenerating"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {{ isGenerating ? 'Generating...' : 'Generate' }}
              </button>
            </div>

            <!-- AI Response -->
            <div *ngIf="aiResponse" class="mt-4">
              <pre
                class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto"
              >
                <code [class]="'language-' + targetLanguage">{{ aiResponse }}</code>
              </pre>

              <div class="flex gap-4 mt-4">
                <button
                  (click)="saveGeneratedCode()"
                  class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
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
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  Save to Snippets
                </button>
                <button
                  (click)="saveToHistory()"
                  class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Save to History
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- History Section -->
      <div class="mt-6 border-t dark:border-gray-700 pt-4">
        <div class="mb-4">
          <input
            type="text"
            [(ngModel)]="searchQuery"
            placeholder="Search saved responses..."
            class="w-full px-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700"
          />
        </div>

        <div class="space-y-4" *ngIf="savedResponses.length > 0">
          <h3 class="text-lg font-semibold">Saved Responses</h3>
          <div class="space-y-4">
            <div
              *ngFor="let item of filteredResponses"
              class="p-4 border rounded-lg dark:border-gray-700"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="font-medium">Prompt:</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    {{ item.prompt }}
                  </div>
                  <div class="mt-2 font-medium">
                    Language: {{ item.language }}
                  </div>
                </div>
                <div class="flex gap-2 ml-4">
                  <button
                    (click)="loadResponse(item)"
                    class="text-blue-600 hover:text-blue-700"
                  >
                    Load
                  </button>
                  <button
                    (click)="saveToSnippets(item)"
                    class="text-green-600 hover:text-green-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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
  targetLanguage = 'javascript';
  aiResponse: string | null = null;
  userInput = '';
  displayedResponse = '';
  isTyping = false;
  typingProgress = 0;
  codeOutput: string = '';
  isExecuting: boolean = false;
  isProcessing = false;

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

  // New properties
  codeToReview = '';
  codeToDebug = '';
  codeToDocument = '';
  codeToTest = '';
  codeForTypes = '';
  codeToConvert = '';
  fromLanguage = 'javascript';
  toLanguage = 'typescript';
  testFramework = 'jest';

  // Loading states
  isReviewing = false;
  isDebugging = false;
  isGeneratingDocs = false;
  isGeneratingTests = false;
  isGeneratingTypes = false;
  isConverting = false;

  // Add new properties
  showTemplates = false;
  templates: CodeTemplate[] = [];
  filteredTemplates: CodeTemplate[] = [];
  selectedLanguage = 'javascript';

  // Add to class properties
  searchQuery = '';
  savedResponses: { prompt: string; response: string; language: string }[] = [];

  isPanelOpen = false;
  isGenerating = false;

  constructor(
    public aiService: AIService,
    private toastr: ToastrService,
    private templatesService: TemplatesService,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.templates = this.templatesService.getTemplates();
    this.filterTemplates();
  }

  togglePanel(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isPanelOpen = !this.isPanelOpen;
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

  async generateResponse() {
    if (!this.userInput) {
      this.toastr.warning('Please enter a prompt');
      return;
    }

    this.isGenerating = true;
    try {
      this.aiResponse = await this.aiService.generateCodeFromPrompt(
        this.userInput,
        this.targetLanguage
      );
      this.highlightCode();
    } catch (error) {
      this.toastr.error('Error generating response');
      console.error('Generation error:', error);
    } finally {
      this.isGenerating = false;
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
    setTimeout(() => {
      Prism.highlightAll();
    }, 100);
  }

  selectTool(tool: AITool) {
    this.tools.forEach((t) => (t.isActive = false));
    tool.isActive = true;
    this.toolSelected.emit(tool);
  }

  async processRequest() {
    try {
      this.isProcessing = true;
      const response = await this.aiService.generateCode(
        this.userInput,
        this.targetLanguage
      );
      this.displayedResponse = response;
      this.highlightCode();
    } catch (error) {
      this.toastr.error('Error processing request');
    } finally {
      this.isProcessing = false;
    }
  }

  async reviewCode() {
    this.isReviewing = true;
    try {
      const result = await this.aiService.reviewCode(this.codeToReview);
      this.displayedResponse = result;
      this.highlightCode();
    } catch (error) {
      this.toastr.error('Error reviewing code');
    } finally {
      this.isReviewing = false;
    }
  }

  async findBugs() {
    this.isDebugging = true;
    try {
      const result = await this.aiService['findBugs'](this.codeToDebug);
      this.displayedResponse = result;
      this.highlightCode();
    } catch (error) {
      this.toastr.error('Error finding bugs');
    } finally {
      this.isDebugging = false;
    }
  }

  async generateDocs() {
    this.isGeneratingDocs = true;
    try {
      const result = await this.aiService.generateDocs(this.codeToDocument);
      this.displayedResponse = result;
      this.highlightCode();
    } catch (error) {
      this.toastr.error('Error generating documentation');
    } finally {
      this.isGeneratingDocs = false;
    }
  }

  async generateTests() {
    this.isGeneratingTests = true;
    try {
      const result = await this.aiService['generateTests'](
        this.codeToTest,
        this.testFramework
      );
      this.displayedResponse = result;
      this.highlightCode();
    } catch (error) {
      this.toastr.error('Error generating tests');
    } finally {
      this.isGeneratingTests = false;
    }
  }

  async generateTypes() {
    this.isGeneratingTypes = true;
    try {
      const result = await this.aiService['generateTypes'](this.codeForTypes);
      this.displayedResponse = result;
      this.highlightCode();
    } catch (error) {
      this.toastr.error('Error generating types');
    } finally {
      this.isGeneratingTypes = false;
    }
  }

  async convertCode() {
    this.isConverting = true;
    try {
      const result = await this.aiService['convertCode'](
        this.codeToConvert,
        this.fromLanguage,
        this.toLanguage
      );
      this.displayedResponse = result;
      this.highlightCode();
    } catch (error) {
      this.toastr.error('Error converting code');
    } finally {
      this.isConverting = false;
    }
  }

  toggleTemplates() {
    this.showTemplates = !this.showTemplates;
  }

  filterTemplates() {
    this.filteredTemplates = this.templates.filter(
      (t) => t.language === this.selectedLanguage
    );
  }

  loadTemplate(template: CodeTemplate) {
    this.userInput = template.code;
    this.showTemplates = false;
    this.toastr.success('Template loaded successfully');
  }

  // When language changes
  onLanguageChange() {
    this.filterTemplates();
  }

  async saveGeneratedCode() {
    try {
      if (!this.aiResponse) {
        this.toastr.warning('No code to save');
        return;
      }

      const newBin: SnipAI = {
        title: 'AI Generated Code',
        code: this.aiResponse,
        language: this.targetLanguage,
        category: 'AI Generated',
        user_id: await this.getUserId(),
        tags: ['ai-generated', this.targetLanguage],
        description: this.userInput,
        is_public: false,
      };

      await this.supabaseService.createCodeBin(newBin);
      this.toastr.success('Code saved successfully');
      this.router.navigate(['/view']);
    } catch (error) {
      this.toastr.error('Error saving code');
      console.error('Save error:', error);
    }
  }

  private async getUserId(): Promise<string> {
    const {
      data: { user },
    } = await this.supabaseService.getCurrentUser();
    return user?.id || '';
  }

  get filteredResponses() {
    if (!this.searchQuery) return this.savedResponses;
    const query = this.searchQuery.toLowerCase();
    return this.savedResponses.filter(
      (item) =>
        item.prompt.toLowerCase().includes(query) ||
        item.response.toLowerCase().includes(query) ||
        item.language.toLowerCase().includes(query)
    );
  }

  saveToHistory() {
    if (!this.aiResponse || !this.userInput) return;

    this.savedResponses.unshift({
      prompt: this.userInput,
      response: this.aiResponse,
      language: this.targetLanguage,
    });

    // Keep only last 10 responses
    if (this.savedResponses.length > 10) {
      this.savedResponses.pop();
    }

    this.toastr.success('Response saved to history');
  }

  loadResponse(item: { prompt: string; response: string; language: string }) {
    this.userInput = item.prompt;
    this.aiResponse = item.response;
    this.targetLanguage = item.language;
    this.highlightCode();
  }

  async saveToSnippets(item: {
    prompt: string;
    response: string;
    language: string;
  }) {
    const newBin: SnipAI = {
      title: 'AI Generated Code',
      code: item.response,
      language: item.language,
      category: 'AI Generated',
      user_id: await this.getUserId(),
      tags: ['ai-generated', item.language],
      description: item.prompt,
      is_public: false,
    };

    try {
      await this.supabaseService.createCodeBin(newBin);
      this.toastr.success('Saved to snippets');
      this.router.navigate(['/view']);
    } catch (error) {
      this.toastr.error('Error saving to snippets');
      console.error('Save error:', error);
    }
  }
}
