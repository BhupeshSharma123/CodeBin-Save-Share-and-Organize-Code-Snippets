import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService, CodeBin } from '../../app/services/supabase.service';
import { ToastrService } from 'ngx-toastr';
import { AIService } from '../../app/services/ai.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-code-bin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-6">
      <form [formGroup]="binForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Title</label
          >
          <input
            type="text"
            formControlName="title"
            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Language</label
          >
          <select
            formControlName="language"
            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>
        </div>

        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Code</label
          >
          <textarea
            formControlName="code"
            rows="10"
            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono"
          ></textarea>
        </div>

        <!-- AI Tools Panel -->
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            AI Tools
          </h3>

          <div class="space-y-4">
            <!-- Code Generation -->
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Generate Code</label
              >
              <div class="mt-1 flex space-x-2">
                <input
                  type="text"
                  [(ngModel)]="promptText"
                  [ngModelOptions]="{ standalone: true }"
                  class="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Describe what you want to create..."
                />
                <button
                  type="button"
                  (click)="generateCode()"
                  [disabled]="!promptText || (aiService.isProcessing$ | async)"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
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
                [disabled]="
                  !binForm.get('code')?.value ||
                  (aiService.isProcessing$ | async)
                "
                class="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                Explain Code
              </button>
              <button
                type="button"
                (click)="improveCode()"
                [disabled]="
                  !binForm.get('code')?.value ||
                  (aiService.isProcessing$ | async)
                "
                class="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                Suggest Improvements
              </button>
            </div>

            <!-- Language Translation -->
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >Translate To:</label
              >
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
                  [disabled]="
                    !binForm.get('code')?.value ||
                    (aiService.isProcessing$ | async)
                  "
                  class="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50"
                >
                  Translate
                </button>
              </div>
            </div>

            <!-- AI Response Display -->
            <div *ngIf="aiResponse" class="mt-4">
              <div class="bg-white dark:bg-gray-900 rounded-lg p-4">
                <pre
                  class="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200"
                  >{{ aiResponse }}</pre
                >
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-4">
          <button
            type="button"
            (click)="cancel()"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            [disabled]="!binForm.valid || isSubmitting"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {{ isEditing ? 'Update' : 'Save' }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class CodeBinComponent implements OnInit {
  binForm: FormGroup;
  isEditing = false;
  isSubmitting = false;
  private binId?: string;
  promptText = '';
  targetLanguage = 'python';
  aiResponse: string | null = null;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    public aiService: AIService
  ) {
    this.binForm = this.fb.group({
      title: ['', Validators.required],
      language: ['javascript', Validators.required],
      code: ['', Validators.required],
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
        });
      } catch (error: any) {
        this.toastr.error('Error loading code bin');
        this.router.navigate(['/view']);
      }
    }
  }

  async onSubmit() {
    if (this.binForm.valid) {
      this.isSubmitting = true;
      try {
        if (this.isEditing && this.binId) {
          await this.supabaseService.updateCodeBin(
            this.binId,
            this.binForm.value
          );
          this.toastr.success('Code bin updated successfully');
        } else {
          await this.supabaseService.createCodeBin(this.binForm.value);
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
    try {
      const code = await this.aiService.generateCodeFromPrompt(
        this.promptText,
        this.binForm.get('language')?.value || 'javascript'
      );
      this.binForm.patchValue({ code });
      this.aiResponse = null;
    } catch (error) {
      this.toastr.error('Error generating code');
    }
  }

  async explainCode() {
    const code = this.binForm.get('code')?.value;
    if (!code) return;
    try {
      this.aiResponse = await this.aiService.explainCode(code);
    } catch (error) {
      this.toastr.error('Error explaining code');
    }
  }

  async improveCode() {
    const code = this.binForm.get('code')?.value;
    if (!code) return;
    try {
      this.aiResponse = await this.aiService.suggestImprovements(code);
    } catch (error) {
      this.toastr.error('Error suggesting improvements');
    }
  }

  async translateCode() {
    const code = this.binForm.get('code')?.value;
    const fromLang = this.binForm.get('language')?.value;
    if (!code || !fromLang) return;
    try {
      this.aiResponse = await this.aiService.translateCode(
        code,
        fromLang,
        this.targetLanguage
      );
    } catch (error) {
      this.toastr.error('Error translating code');
    }
  }
}
