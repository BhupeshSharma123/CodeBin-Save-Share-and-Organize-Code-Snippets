import {
  Component,
  OnInit,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { SupabaseService, SnipAI } from '../../app/services/supabase.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TagInputComponent } from '../tag-input/tag-input.component';
import { ExportService } from '../../app/services/export.service';

@Component({
  selector: 'app-data-view',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TagInputComponent],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Sidebar - Only show in list view -->
      <div
        *ngIf="!route.snapshot.paramMap.get('id')"
        class="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-200"
      >
        <!-- Search Bar -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <div class="relative">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearch()"
              placeholder="Search snippets..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
            />
            <svg
              class="w-5 h-5 absolute right-3 top-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <!-- Categories -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Categories
          </h3>
          <div class="space-y-2">
            <button
              *ngFor="let category of categories"
              (click)="filterByCategory(category)"
              class="w-full text-left px-3 py-2 rounded-lg transition-colors"
              [class.bg-blue-50]="selectedCategory === category"
              [class.dark:bg-blue-900]="selectedCategory === category"
              [class.text-blue-600]="selectedCategory === category"
              [class.dark:text-blue-400]="selectedCategory === category"
            >
              {{ category }}
              <span class="float-right text-sm text-gray-500">{{
                getCategoryCount(category)
              }}</span>
            </button>
          </div>
        </div>

        <!-- Tags -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Tags
          </h3>
          <app-tag-input
            [(tags)]="selectedTags"
            (tagsChange)="filterByTags()"
          ></app-tag-input>
        </div>

        <!-- Snippet List -->
        <div class="overflow-y-auto max-h-[calc(100vh-16rem)]">
          <div
            *ngFor="let bin of filteredBins"
            (click)="selectBin(bin)"
            class="p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            [class.bg-blue-50]="selectedBin?.id === bin.id"
            [class.dark:bg-blue-900]="selectedBin?.id === bin.id"
          >
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
              {{ bin.title }}
            </h3>
            <div class="flex items-center mt-1 space-x-2">
              <span class="text-sm text-gray-500 dark:text-gray-400">{{
                bin.language
              }}</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">•</span>
              <span class="text-sm text-gray-500 dark:text-gray-400">{{
                getCategory(bin)
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content - Adjust span based on view -->
      <div
        [class]="
          route.snapshot.paramMap.get('id') ? 'lg:col-span-3' : 'lg:col-span-2'
        "
      >
        <div
          *ngIf="selectedBin"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-200"
        >
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
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

              <!-- Action Buttons -->
              <div class="flex space-x-2">
                <!-- Edit Button -->
                <a
                  [routerLink]="['/edit', selectedBin.id]"
                  class="inline-flex items-center px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
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

                <!-- Delete Button -->
                <button
                  (click)="confirmDelete(selectedBin.id!)"
                  class="inline-flex items-center px-3 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800"
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

                <!-- Copy Button -->
                <button
                  (click)="copyToClipboard(selectedBin.code)"
                  class="inline-flex items-center px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
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
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                  Copy
                </button>

                <!-- Share Dropdown -->
                <div #shareDropdown class="relative">
                  <button
                    (click)="toggleShareMenu()"
                    class="inline-flex items-center px-3 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800"
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
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                    Share
                  </button>

                  <!-- Share Menu -->
                  <div
                    *ngIf="isShareMenuOpen"
                    class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50"
                  >
                    <div class="p-2 space-y-2">
                      <!-- Twitter -->
                      <a
                        [href]="getShareUrl('twitter')"
                        target="_blank"
                        class="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      >
                        <svg
                          class="w-5 h-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"
                          />
                        </svg>
                        Twitter
                      </a>

                      <!-- LinkedIn -->
                      <a
                        [href]="getShareUrl('linkedin')"
                        target="_blank"
                        class="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      >
                        <svg
                          class="w-5 h-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                          />
                        </svg>
                        LinkedIn
                      </a>

                      <!-- WhatsApp -->
                      <a
                        [href]="getShareUrl('whatsapp')"
                        target="_blank"
                        class="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      >
                        <svg
                          class="w-5 h-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                          />
                        </svg>
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>

                <!-- Version History button -->
                <button
                  (click)="showVersionHistory(selectedBin.id!)"
                  class="inline-flex items-center px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-200 dark:hover:bg-purple-800"
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  History
                </button>

                <!-- Share button -->
                <button
                  (click)="toggleShare(selectedBin)"
                  class="inline-flex items-center px-3 py-1 text-sm"
                  [class]="
                    selectedBin.is_public
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  "
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
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                  {{ selectedBin.is_public ? 'Public' : 'Private' }}
                </button>

                <!-- Export/Import -->
                <div class="relative">
                  <button
                    (click)="showExportModal = true"
                    class="inline-flex items-center px-3 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800"
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
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Export/Import
                  </button>

                  <!-- Export Modal -->
                  <div
                    *ngIf="showExportModal"
                    class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50"
                  >
                    <div class="py-1">
                      <button
                        (click)="exportToGist(selectedBin)"
                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Export to GitHub Gist
                      </button>
                      <button
                        (click)="exportToPDF(selectedBin)"
                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Export as PDF
                      </button>
                      <button
                        (click)="exportToMarkdown(selectedBin)"
                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Export as Markdown
                      </button>
                      <button
                        (click)="backupAllSnippets()"
                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Backup All Snippets
                      </button>
                      <button
                        (click)="importFromGist()"
                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Import from Gist
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <pre
              class="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded overflow-x-auto font-mono text-sm text-gray-900 dark:text-gray-100"
              >{{ selectedBin.code }}</pre
            >
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

    <!-- Version History Modal -->
    <div
      *ngIf="showVersionModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <div
        class="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      >
        <div class="p-4 border-b dark:border-gray-700">
          <h2 class="text-xl font-semibold">Version History</h2>
        </div>
        <div class="p-4">
          <div
            *ngFor="let version of versions"
            class="mb-4 p-4 border rounded dark:border-gray-700"
          >
            <div class="flex justify-between items-center mb-2">
              <span class="font-semibold"
                >Version {{ version.version_number }}</span
              >
              <span class="text-sm text-gray-500">{{
                version.created_at | date
              }}</span>
            </div>
            <p
              *ngIf="version.comment"
              class="text-gray-600 dark:text-gray-400 mb-2"
            >
              {{ version.comment }}
            </p>
            <button
              (click)="restoreVersion(version)"
              class="text-blue-600 dark:text-blue-400 text-sm hover:underline"
            >
              Restore this version
            </button>
          </div>
        </div>
        <div class="p-4 border-t dark:border-gray-700">
          <button
            (click)="closeVersionModal()"
            class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  `,
})
export class DataViewComponent implements OnInit {
  @ViewChild('shareDropdown') shareDropdown!: ElementRef;
  codeBins: SnipAI[] = [];
  selectedBin: SnipAI | null = null;
  isShareMenuOpen = false;
  searchQuery = '';
  selectedCategory: string | null = null;
  categories: string[] = [
    'All',
    'Utilities',
    'Algorithms',
    'UI Components',
    'API',
    'Database',
  ];
  filteredBins: SnipAI[] = [];
  availableTags: string[] = [];
  selectedTags: string[] = [];
  versions: any[] = [];
  showVersionModal = false;
  showExportModal = false;
  githubToken = '';

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private supabaseService: SupabaseService,
    private toastr: ToastrService,
    private exportService: ExportService
  ) {}

  async ngOnInit() {
    try {
      const id = this.route.snapshot.paramMap.get('id');

      if (id) {
        // Single snippet view
        this.selectedBin = await this.supabaseService.getCodeBin(id);
        if (!this.selectedBin) {
          this.toastr.error('Snippet not found');
          this.router.navigate(['/view']);
        }
      } else {
        // List view
        await this.loadSnippets();
      }
    } catch (error) {
      this.toastr.error('Error loading snippets');
      console.error('Error:', error);
    }
  }

  selectBin(bin: SnipAI) {
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

  async copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      this.toastr.success('Code copied to clipboard');
    } catch (error) {
      this.toastr.error('Failed to copy code');
    }
  }

  toggleShareMenu() {
    this.isShareMenuOpen = !this.isShareMenuOpen;
  }

  getShareUrl(platform: 'twitter' | 'linkedin' | 'whatsapp'): string {
    const url = encodeURIComponent(
      `${window.location.origin}/view/${this.selectedBin?.id}`
    );
    const text = encodeURIComponent(
      `Check out this code snippet: ${this.selectedBin?.title}`
    );

    switch (platform) {
      case 'twitter':
        return `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
      case 'linkedin':
        return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
      case 'whatsapp':
        return `https://wa.me/?text=${text}%20${url}`;
      default:
        return '';
    }
  }

  // Close share menu when clicking outside
  @HostListener('document:click', ['$event'])
  closeShareMenu(event: MouseEvent) {
    if (!this.shareDropdown.nativeElement.contains(event.target)) {
      this.isShareMenuOpen = false;
    }
  }

  async confirmDelete(id: string) {
    if (confirm('Are you sure you want to delete this code bin?')) {
      try {
        await this.supabaseService.deleteCodeBin(id);
        this.codeBins = this.codeBins.filter((bin) => bin.id !== id);
        this.selectedBin = null;
        this.toastr.success('Code bin deleted successfully');
      } catch (error) {
        this.toastr.error('Error deleting code bin');
      }
    }
  }

  onSearch() {
    this.filterSnippets();
  }

  filterByCategory(category: string) {
    this.selectedCategory = category === 'All' ? null : category;
    this.filterSnippets();
  }

  filterByTags() {
    if (this.selectedTags.length === 0) {
      this.filteredBins = this.codeBins;
      return;
    }

    this.filteredBins = this.codeBins.filter((bin) =>
      this.selectedTags.every((tag) => bin.tags?.includes(tag))
    );
  }

  filterSnippets() {
    let filtered = [...this.codeBins];

    // Apply search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (bin) =>
          bin.title.toLowerCase().includes(query) ||
          bin.code.toLowerCase().includes(query) ||
          bin.language.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(
        (bin) => this.getCategory(bin) === this.selectedCategory
      );
    }

    // Add tag filtering
    if (this.selectedTags.length > 0) {
      filtered = filtered.filter((bin) =>
        this.selectedTags.every((tag) => bin.tags?.includes(tag))
      );
    }

    this.filteredBins = filtered;
  }

  getCategory(bin: SnipAI): string {
    return bin.category || 'Utilities';
  }

  getCategoryCount(category: string): number {
    if (category === 'All') return this.codeBins.length;
    return this.codeBins.filter((bin) => this.getCategory(bin) === category)
      .length;
  }

  async updateCategory(bin: SnipAI, newCategory: string) {
    try {
      await this.supabaseService.updateCodeBin(bin.id!, {
        ...bin,
        category: newCategory,
      });
      bin.category = newCategory;
      this.toastr.success('Category updated successfully');
    } catch (error) {
      this.toastr.error('Error updating category');
    }
  }

  async showVersionHistory(binId: string) {
    try {
      this.versions = await this.supabaseService.getVersions(binId);
      this.showVersionModal = true;
    } catch (error) {
      this.toastr.error('Error loading version history');
    }
  }

  closeVersionModal() {
    this.showVersionModal = false;
  }

  async restoreVersion(version: any) {
    if (!this.selectedBin) return;

    try {
      await this.supabaseService.updateCodeBin(this.selectedBin.id!, {
        ...this.selectedBin,
        code: version.code,
      });

      // Create new version to track the restoration
      await this.supabaseService.createVersion(
        this.selectedBin.id!,
        version.code,
        `Restored from version ${version.version_number}`
      );

      this.selectedBin.code = version.code;
      this.closeVersionModal();
      this.toastr.success('Version restored successfully');
    } catch (error) {
      this.toastr.error('Error restoring version');
    }
  }

  async toggleShare(bin: SnipAI) {
    try {
      const updated = await this.supabaseService.shareCodeBin(
        bin.id!,
        !bin.is_public
      );
      bin.is_public = updated.is_public;
      this.toastr.success(
        bin.is_public ? 'Snippet is now public' : 'Snippet is now private'
      );
    } catch (error) {
      this.toastr.error('Error updating sharing settings');
    }
  }

  // Export methods
  async exportToGist(snippet: SnipAI) {
    try {
      // Prompt for GitHub token if not stored
      if (!this.githubToken) {
        this.githubToken = prompt('Please enter your GitHub token:') || '';
        if (!this.githubToken) {
          this.toastr.error('GitHub token is required');
          return;
        }
      }

      const url = await this.exportService.exportToGist(
        snippet,
        this.githubToken
      );
      if (url) {
        this.toastr.success('Successfully exported to GitHub Gist');
        window.open(url, '_blank');
      }
    } catch (error: any) {
      this.toastr.error(error.message || 'Failed to export to GitHub Gist');
      // Clear token if unauthorized
      if (error.status === 401) {
        this.githubToken = '';
      }
    }
  }

  async exportToPDF(snippet: SnipAI) {
    try {
      const pdfBlob = await this.exportService.exportToPDF(snippet);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${snippet.title}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
      this.toastr.success('PDF exported successfully');
    } catch (error) {
      this.toastr.error('Failed to export PDF');
    }
  }

  exportToMarkdown(snippet: SnipAI) {
    try {
      const markdown = this.exportService.exportToMarkdown(snippet);
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${snippet.title}.md`;
      link.click();
      URL.revokeObjectURL(url);
      this.toastr.success('Markdown exported successfully');
    } catch (error) {
      this.toastr.error('Failed to export Markdown');
    }
  }

  async backupAllSnippets() {
    try {
      const blob = await this.exportService.backupAllSnippets();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `snippets-backup-${new Date().toISOString()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      this.toastr.success('Backup created successfully');
    } catch (error) {
      this.toastr.error('Failed to create backup');
    }
  }

  async importFromGist() {
    const gistId = prompt('Enter Gist ID:');
    if (!gistId) return;

    try {
      const snippet = await this.exportService.importFromGithub(gistId);
      await this.supabaseService.createCodeBin(snippet);
      this.toastr.success('Successfully imported from GitHub Gist');
      this.loadSnippets(); // Refresh the list
    } catch (error) {
      this.toastr.error('Failed to import from GitHub Gist');
    }
  }

  async loadSnippets() {
    try {
      this.codeBins = await this.supabaseService.getUserCodeBins();
      this.filteredBins = this.codeBins;
    } catch (error) {
      this.toastr.error('Error loading snippets');
    }
  }

  async editBin(bin: SnipAI) {
    try {
      if (!bin.id) {
        this.toastr.error('Invalid snippet');
        return;
      }
      await this.router.navigate(['/edit', bin.id]);
    } catch (error) {
      this.toastr.error('Error navigating to edit page');
    }
  }
}
