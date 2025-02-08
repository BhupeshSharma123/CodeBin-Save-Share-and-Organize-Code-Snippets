import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService, SnipAI } from '../../app/services/supabase.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-shared-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="responsive-container py-8">
      <div *ngIf="snippet" class="responsive-card">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <h1 class="text-2xl font-bold">{{ snippet.title }}</h1>
            <p class="text-sm text-gray-500">
              Language: {{ snippet.language }} • Shared {{ snippet.created_at | date }}
            </p>
          </div>
          <button
            (click)="copyToClipboard()"
            class="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
          >
            Copy Code
          </button>
        </div>

        <!-- Code Display -->
        <pre class="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
          <code [class]="'language-' + snippet.language">{{ snippet.code }}</code>
        </pre>

        <!-- Tags -->
        <div *ngIf="snippet.tags?.length" class="mt-4 flex flex-wrap gap-2">
          <span
            *ngFor="let tag of snippet.tags"
            class="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded"
          >
            {{ tag }}
          </span>
        </div>

        <!-- Description -->
        <p *ngIf="snippet.description" class="mt-4 text-gray-600 dark:text-gray-300">
          {{ snippet.description }}
        </p>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p class="mt-4 text-gray-600">Loading shared snippet...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="text-center py-12">
        <p class="text-red-500">{{ error }}</p>
        <button
          routerLink="/"
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Go Home
        </button>
      </div>
    </div>
  `
})
export class SharedViewComponent implements OnInit {
  snippet: SnipAI | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supabaseService: SupabaseService,
    private toastr: ToastrService
  ) {}

  async ngOnInit() {
    try {
      const token = this.route.snapshot.paramMap.get('token');
      if (!token) throw new Error('Invalid share link');

      this.snippet = await this.supabaseService.getSharedCodeBin(token);
    } catch (error: any) {
      this.error = error.message || 'Error loading shared snippet';
    } finally {
      this.loading = false;
    }
  }

  async copyToClipboard() {
    if (!this.snippet?.code) return;
    
    try {
      await navigator.clipboard.writeText(this.snippet.code);
      this.toastr.success('Code copied to clipboard');
    } catch {
      this.toastr.error('Failed to copy code');
    }
  }
} 