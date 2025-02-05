import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupabaseService, CodeBin } from '../../app/services/supabase.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-data-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="flex h-screen bg-gray-100 dark:bg-gray-900">
      <!-- Side Menu -->
      <div class="w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-800 dark:text-white">
            My Code Bins
          </h2>
        </div>
        <div class="overflow-y-auto h-full">
          <div class="space-y-1 p-2">
            <button
              *ngFor="let bin of codeBins"
              (click)="selectBin(bin)"
              class="w-full text-left px-4 py-2 rounded-md transition-colors"
              [class.bg-blue-50]="selectedBin?.id === bin.id"
              [class.dark:bg-gray-700]="selectedBin?.id === bin.id"
              [class.text-blue-600]="selectedBin?.id === bin.id"
              [class.dark:text-blue-400]="selectedBin?.id === bin.id"
              [class.hover:bg-gray-100]="selectedBin?.id !== bin.id"
              [class.dark:hover:bg-gray-700]="selectedBin?.id !== bin.id"
              [class.text-gray-700]="selectedBin?.id !== bin.id"
              [class.dark:text-gray-300]="selectedBin?.id !== bin.id"
            >
              <div class="font-medium truncate">{{ bin.title }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ bin.language }} • {{ bin.created_at | date : 'short' }}
              </div>
            </button>
          </div>
        </div>
        <div class="p-4 border-t border-gray-200 dark:border-gray-700">
          <a
            routerLink="/bin"
            class="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <svg
              class="w-5 h-5 mr-2"
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
            New Bin
          </a>
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 overflow-auto p-6">
        <div *ngIf="selectedBin" class="max-w-3xl mx-auto">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div class="p-6">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h2
                    class="text-2xl font-semibold text-gray-900 dark:text-white"
                  >
                    {{ selectedBin.title }}
                  </h2>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Language: {{ selectedBin.language }}
                    <span class="mx-2">•</span>
                    Created: {{ selectedBin.created_at | date }}
                  </p>
                </div>
                <div class="space-x-2">
                  <a
                    [routerLink]="['/edit', selectedBin.id]"
                    class="inline-flex items-center px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    <svg
                      class="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </a>
                  <button
                    (click)="deleteBin(selectedBin.id!)"
                    class="inline-flex items-center px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                  >
                    <svg
                      class="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
              <pre
                class="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded overflow-x-auto font-mono text-sm text-gray-900 dark:text-gray-100"
                >{{ selectedBin.code }}</pre
              >
            </div>
          </div>
        </div>

        <div
          *ngIf="!selectedBin && codeBins.length > 0"
          class="text-center py-12 text-gray-500 dark:text-gray-400"
        >
          Select a code bin from the sidebar to view its contents
        </div>

        <div
          *ngIf="codeBins.length === 0"
          class="text-center py-12 text-gray-500 dark:text-gray-400"
        >
          No code bins yet. Create your first one!
        </div>
      </div>
    </div>
  `,
})
export class DataViewComponent implements OnInit {
  codeBins: CodeBin[] = [];
  selectedBin: CodeBin | null = null;

  constructor(
    private supabaseService: SupabaseService,
    private toastr: ToastrService
  ) {}

  async ngOnInit() {
    try {
      this.codeBins = await this.supabaseService.getUserCodeBins();
      if (this.codeBins.length > 0) {
        this.selectedBin = this.codeBins[0];
      }
    } catch (error: any) {
      this.toastr.error('Error loading code bins');
    }
  }

  selectBin(bin: CodeBin) {
    this.selectedBin = bin;
  }

  async deleteBin(id: string) {
    if (confirm('Are you sure you want to delete this code bin?')) {
      try {
        await this.supabaseService.deleteCodeBin(id);
        this.codeBins = this.codeBins.filter((bin) => bin.id !== id);
        this.selectedBin = this.codeBins.length > 0 ? this.codeBins[0] : null;
        this.toastr.success('Code bin deleted successfully');
      } catch (error: any) {
        this.toastr.error('Error deleting code bin');
      }
    }
  }
}
