import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isLoading" class="loading-state" [class]="type">
      <div *ngIf="type === 'code'" class="code-loading">
        <div class="shimmer-line w-3/4"></div>
        <div class="shimmer-line w-1/2"></div>
        <div class="shimmer-line w-2/3"></div>
      </div>
      <div *ngIf="type === 'text'" class="text-loading">
        <div class="shimmer-line"></div>
        <div class="shimmer-line w-3/4"></div>
      </div>
    </div>
  `,
  styles: [`
    .loading-state {
      @apply p-4 rounded-lg bg-gray-50 dark:bg-gray-800;
    }
    .shimmer-line {
      @apply h-4 mb-3 rounded bg-gray-200 dark:bg-gray-700 shimmer;
    }
    .code-loading .shimmer-line {
      @apply font-mono;
    }
  `]
})
export class LoadingStateComponent {
  @Input() isLoading: boolean = false;
  @Input() type: 'code' | 'text' = 'text';
} 