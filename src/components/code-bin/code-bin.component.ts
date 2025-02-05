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
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
          </select>

          <textarea
            formControlName="code"
            rows="12"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
            placeholder="Paste your code here..."
          ></textarea>
        </div>

        <!-- AI Tools with updated styling -->
        <app-ai-tools
          [code]="binForm.get('code')?.value || ''"
          (applyCode)="applyGeneratedCode($event)"
          class="block mt-6"
        ></app-ai-tools>

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

  applyGeneratedCode(code: string) {
    this.binForm.patchValue({ code });
  }
}
