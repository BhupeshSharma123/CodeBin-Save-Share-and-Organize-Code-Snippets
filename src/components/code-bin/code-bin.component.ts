import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService, SnipAI } from '../../app/services/supabase.service';
import { ToastrService } from 'ngx-toastr';
import { AIService } from '../../app/services/ai.service';
import { FormsModule } from '@angular/forms';
import { AIToolsComponent } from '../ai-tools/ai-tools.component';
import { MonacoEditorService } from '../../app/services/monaco-editor.service';

@Component({
  selector: 'app-code-bin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, AIToolsComponent],
  template: `
    <div
      class="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-200"
    >
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {{ isEditing ? 'Edit Snippet' : 'Create New Snippet' }}
      </h2>
      <form [formGroup]="binForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <div class="space-y-4">
          <input
            type="text"
            formControlName="title"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
            placeholder="Snippet Title"
          />

          <select
            formControlName="language"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="csharp">C#</option>
          </select>
          <div
            *ngIf="binForm.get('code')?.value"
            class="text-sm text-gray-500 dark:text-gray-400 mt-1"
          >
            Language detected automatically
          </div>

          <textarea
            formControlName="code"
            rows="12"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            placeholder="Paste your code here..."
          ></textarea>

          <!-- Code Actions Toolbar -->
          <div class="flex gap-3 mt-4">
            <button
              (click)="runCode()"
              class="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
            >
              <i class="fas fa-play"></i> Run
            </button>

            <button
              (click)="clearCode()"
              class="px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 flex items-center gap-2"
            >
              <i class="fas fa-eraser"></i> Clear
            </button>

            <button
              (click)="downloadCode()"
              class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
            >
              <i class="fas fa-download"></i> Download
            </button>

            <select
              [(ngModel)]="selectedTemplate"
              [ngModelOptions]="{ standalone: true }"
              (change)="loadTemplate()"
              class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Load Template...</option>
              <option value="hello">Hello World</option>
              <option value="function">Function Template</option>
              <option value="class">Class Template</option>
            </select>
          </div>

          <!-- Code Output Area -->
          <div *ngIf="codeOutput !== null" class="mt-4">
            <div class="flex justify-between items-center mb-2">
              <h3
                class="text-lg font-semibold text-gray-700 dark:text-gray-300"
              >
                Console Output
              </h3>
              <button
                (click)="clearOutput()"
                class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Clear Console
              </button>
            </div>
            <div
              class="bg-[#1e1e1e] rounded-lg p-4 font-mono text-sm overflow-auto max-h-48 terminal-output"
            >
              <pre
                [innerHTML]="formattedOutput"
                class="text-white font-[Consolas,Monaco,'Courier New',monospace]"
              ></pre>
            </div>
          </div>
        </div>

        <div class="space-y-4 mt-4">
          <div class="flex gap-4">
            <input
              type="text"
              [(ngModel)]="promptText"
              [ngModelOptions]="{ standalone: true }"
              placeholder="Enter your prompt for code generation..."
              class="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />

            <select
              [(ngModel)]="generationLanguage"
              [ngModelOptions]="{ standalone: true }"
              class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="csharp">C#</option>
            </select>

            <button
              (click)="generateCode()"
              [disabled]="!promptText"
              class="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Generate
            </button>
          </div>
        </div>

        <!-- AI Tools Dropdown -->
        <div class="flex gap-4 mt-6">
          <select
            [(ngModel)]="selectedAIAction"
            [ngModelOptions]="{ standalone: true }"
            class="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            <option value="">Select AI Action</option>
            <option value="explain">Explain Code</option>
            <option value="improve">Improve Code</option>
            <option value="translate">Translate Code</option>
          </select>

          <button
            (click)="executeAIAction()"
            [disabled]="!selectedAIAction"
            class="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Execute
          </button>
        </div>

        <!-- Loading overlay -->
        <div *ngIf="isGenerating" class="loading-overlay">
          <div class="loading-content">
            <div class="loading-spinner"></div>
            <p class="loading-text">Generating Code...</p>
          </div>
        </div>

        <div class="mb-4">
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Version Comment (optional)
          </label>
          <input
            type="text"
            [(ngModel)]="versionComment"
            [ngModelOptions]="{ standalone: true }"
            placeholder="Describe your changes..."
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        <div class="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            (click)="cancel()"
            class="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            [disabled]="!binForm.valid || isSubmitting"
            class="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-all duration-200"
          >
            {{ isEditing ? 'Update' : 'Save' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        backdrop-filter: blur(3px);
      }

      .loading-content {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .loading-spinner {
        border: 4px solid rgba(0, 0, 0, 0.1);
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border-left-color: #09f;
        animation: spin 1s ease infinite;
        margin: 0 auto;
      }

      .loading-text {
        margin-top: 1rem;
        color: #333;
        font-weight: 500;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .terminal-output {
        font-family: Consolas, Monaco, 'Courier New', monospace;
        line-height: 1.5;
      }
      .terminal-output pre {
        white-space: pre-wrap;
        word-wrap: break-word;
      }
      .terminal-output .string {
        color: #a8ff60;
      }
      .terminal-output .number {
        color: #ff9d00;
      }
      .terminal-output .boolean {
        color: #ff628c;
      }
      .terminal-output .null {
        color: #ff628c;
      }
      .terminal-output .undefined {
        color: #ff628c;
      }
      .terminal-output .error {
        color: #ff0000;
      }
      .terminal-output .console-log {
        color: #cccccc;
      }
      .terminal-output .console-info {
        color: #6fb3d2;
      }
      .terminal-output .console-warn {
        color: #ffcb6b;
      }
      .terminal-output .console-error {
        color: #ff5370;
      }
    `,
  ],
})
export class CodeBinComponent implements OnInit {
  binForm: FormGroup;
  isEditing = false;
  isSubmitting = false;
  private binId?: string;
  promptText = '';
  targetLanguage = 'python';
  aiResponse: string | null = null;
  selectedLanguage: string = 'javascript'; // Default language
  isGenerating = false;
  generationLanguage: string = 'javascript';
  selectedAIAction: string = '';
  selectedTemplate: string = '';
  codeOutput: string | null = null;
  categories: string[] = [
    'Utilities',
    'Algorithms',
    'UI Components',
    'API',
    'Database',
  ];
  selectedCategory: string = 'Utilities';
  versionComment = '';

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    public aiService: AIService,
    private monacoEditorService: MonacoEditorService
  ) {
    this.binForm = this.fb.group({
      title: ['', Validators.required],
      language: ['javascript', Validators.required],
      code: ['', Validators.required],
      category: ['Utilities', Validators.required],
    });
  }

  async ngOnInit() {
    // Check if we're editing an existing bin
    this.binId = this.route.snapshot.paramMap.get('id') ?? undefined;

    if (this.binId) {
      this.isEditing = true;
      try {
        const bin = await this.supabaseService.getCodeBin(this.binId);
        this.binForm.patchValue({
          title: bin.title,
          language: bin.language,
          code: bin.code,
          category: bin.category,
        });
      } catch (error: any) {
        this.toastr.error('Error loading code bin');
        this.router.navigate(['/view']);
      }
    }

    // Listen for code changes
    this.binForm.get('code')?.valueChanges.subscribe(async (code) => {
      await this.onCodeChange();
    });
  }

  async onSubmit() {
    if (this.binForm.valid) {
      this.isSubmitting = true;
      try {
        const user = await this.supabaseService.getCurrentUser();
        const binData: SnipAI = {
          ...this.binForm.value,
          user_id: user.data.user?.id || '',
        };

        if (this.isEditing && this.binId) {
          // Update existing bin
          const updatedBin = await this.supabaseService.updateCodeBin(
            this.binId,
            {
              ...binData,
              id: this.binId,
            }
          );

          // Create version record
          if (this.versionComment) {
            await this.supabaseService.createVersion(
              this.binId,
              binData.code,
              this.versionComment
            );
          }

          this.toastr.success('Code bin updated successfully');
        } else {
          // Create new bin
          const newBin = await this.supabaseService.createCodeBin(binData);
          this.toastr.success('Code bin created successfully');
        }

        this.router.navigate(['/view']);
      } catch (error: any) {
        this.toastr.error(error.message || 'Error saving code bin');
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  cancel() {
    this.router.navigate(['/view']);
  }

  async generateCode() {
    if (!this.promptText) return;
    this.isGenerating = true;
    try {
      const code = await this.aiService.generateCodeFromPrompt(
        this.promptText,
        this.generationLanguage
      );
      this.binForm.patchValue({ code });
      this.aiResponse = null;
    } catch (error) {
      this.toastr.error('Error generating code');
    } finally {
      this.isGenerating = false;
    }
  }

  async executeAIAction() {
    if (!this.selectedAIAction) return;

    const code = this.binForm.get('code')?.value;
    if (!code) return;

    this.isGenerating = true;
    try {
      switch (this.selectedAIAction) {
        case 'explain':
          this.aiResponse = await this.aiService.explainCode(code);
          break;
        case 'improve':
          this.aiResponse = await this.aiService.suggestImprovements(code);
          break;
        case 'translate':
          this.aiResponse = await this.aiService.translateCode(
            code,
            this.binForm.get('language')?.value,
            this.generationLanguage
          );
          break;
      }
    } catch (error) {
      this.toastr.error(`Error performing ${this.selectedAIAction} action`);
    } finally {
      this.isGenerating = false;
    }
  }

  executeCode() {
    try {
      const result = this.monacoEditorService.executeCode(
        this.selectedLanguage,
        this.binForm.get('code')?.value || ''
      );
      // handle result...
    } catch (error) {
      // handle error...
    }
  }

  async detectLanguage(code: string): Promise<string> {
    if (!code?.trim()) return 'javascript'; // default

    // Common language patterns
    const patterns = {
      python:
        /\b(def|import|from|class|if __name__ == ['"]__main__['"]:)\b|\.py\b/i,
      javascript: /\b(const|let|var|function|=>)\b|\.js\b/i,
      typescript: /\b(interface|type|namespace)\b|\.ts\b/i,
      java: /\b(public|private|class|void|String)\b|\.java\b/i,
      cpp: /\b(#include|namespace|cout|cin)\b|\.cpp\b/i,
      csharp: /\b(namespace|using|class|public|private)\b|\.cs\b/i,
    };

    for (const [lang, pattern] of Object.entries(patterns)) {
      if (pattern.test(code)) {
        return lang;
      }
    }

    return 'javascript'; // default if no match
  }

  async onCodeChange() {
    const code = this.binForm.get('code')?.value;
    if (code) {
      const detectedLang = await this.detectLanguage(code);
      this.binForm.patchValue({ language: detectedLang }, { emitEvent: false });
    }
    this.codeOutput = null;
  }

  get formattedOutput(): string {
    if (!this.codeOutput) return '';

    // Split output into lines
    return this.codeOutput
      .split('\n')
      .map((line) => {
        // Style console methods
        if (line.includes('console.log')) {
          return `<span class="console-log">${this.syntaxHighlight(
            line
          )}</span>`;
        }
        if (line.includes('console.error')) {
          return `<span class="console-error">${this.syntaxHighlight(
            line
          )}</span>`;
        }
        if (line.includes('console.warn')) {
          return `<span class="console-warn">${this.syntaxHighlight(
            line
          )}</span>`;
        }
        if (line.includes('console.info')) {
          return `<span class="console-info">${this.syntaxHighlight(
            line
          )}</span>`;
        }
        if (line.startsWith('Error:')) {
          return `<span class="error">${line}</span>`;
        }

        // Default syntax highlighting
        return this.syntaxHighlight(line);
      })
      .join('\n');
  }

  private syntaxHighlight(text: string): string {
    // Replace string literals
    text = text.replace(
      /"([^"\\]*(\\.[^"\\]*)*)"|'([^'\\]*(\\.[^'\\]*)*)'|`([^`\\]*(\\.[^`\\]*)*)`/g,
      (match) => `<span class="string">${match}</span>`
    );

    // Replace numbers
    text = text.replace(
      /\b(\d+(\.\d+)?)\b/g,
      (match) => `<span class="number">${match}</span>`
    );

    // Replace booleans
    text = text.replace(
      /\b(true|false)\b/g,
      (match) => `<span class="boolean">${match}</span>`
    );

    // Replace null and undefined
    text = text.replace(
      /\b(null|undefined)\b/g,
      (match) => `<span class="null">${match}</span>`
    );

    return text;
  }

  async runCode() {
    const code = this.binForm.get('code')?.value;
    if (!code) return;

    this.isGenerating = true;
    try {
      const result = await this.monacoEditorService.executeCode(
        this.binForm.get('language')?.value,
        code
      );
      this.codeOutput = result;
      this.toastr.success('Code executed successfully');
    } catch (error: any) {
      this.codeOutput = `Error: ${error.message}`;
      this.toastr.error(error.message || 'Error executing code');
    } finally {
      this.isGenerating = false;
    }
  }

  clearCode() {
    if (confirm('Are you sure you want to clear the code?')) {
      this.binForm.patchValue({ code: '' });
    }
  }

  downloadCode() {
    const code = this.binForm.get('code')?.value;
    if (!code) return;

    const language = this.binForm.get('language')?.value;
    const extension = this.getFileExtension(language);
    const filename = `code${extension}`;

    const blob = new Blob([code], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private getFileExtension(language: string): string {
    const extensions: { [key: string]: string } = {
      javascript: '.js',
      typescript: '.ts',
      python: '.py',
      java: '.java',
      cpp: '.cpp',
      csharp: '.cs',
    };
    return extensions[language] || '.txt';
  }

  loadTemplate() {
    if (!this.selectedTemplate) return;

    const templates: { [key: string]: string } = {
      hello: `// Hello World Template
console.log("Hello, World!");`,
      function: `// Function Template
function calculateSum(a, b) {
  return a + b;
}`,
      class: `// Class Template
class Example {
  constructor() {
    this.value = 0;
  }

  setValue(val) {
    this.value = val;
  }

  getValue() {
    return this.value;
  }
}`,
    };

    const template = templates[this.selectedTemplate];
    if (template) {
      this.binForm.patchValue({ code: template });
    }
    this.selectedTemplate = ''; // Reset selection
  }

  clearOutput() {
    this.codeOutput = null;
  }
}
