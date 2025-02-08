import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PerformanceService, PerformanceMetric } from '../../app/services/performance.service';

@Component({
  selector: 'app-performance-metrics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <h3 class="text-lg font-semibold mb-4">Performance Analysis</h3>
      
      <div class="space-y-4">
        <div *ngFor="let metric of metrics" class="border-l-4 p-4 rounded"
          [class.border-yellow-500]="metric.severity === 'low'"
          [class.border-orange-500]="metric.severity === 'medium'"
          [class.border-red-500]="metric.severity === 'high'"
        >
          <div class="flex justify-between items-start">
            <div>
              <h4 class="font-medium">{{ metric.type }}</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ metric.description }}
              </p>
            </div>
            <span class="px-2 py-1 text-xs rounded"
              [class.bg-yellow-100.text-yellow-800]="metric.severity === 'low'"
              [class.bg-orange-100.text-orange-800]="metric.severity === 'medium'"
              [class.bg-red-100.text-red-800]="metric.severity === 'high'"
            >
              {{ metric.severity }}
            </span>
          </div>
          
          <div class="mt-2 text-sm">
            <span class="font-medium">Suggestion:</span>
            <span class="text-gray-600 dark:text-gray-400">{{ metric.suggestion }}</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PerformanceMetricsComponent implements OnChanges {
  @Input() code = '';
  @Input() language = 'javascript';
  metrics: PerformanceMetric[] = [];

  constructor(private performanceService: PerformanceService) {}

  ngOnChanges() {
    this.updateMetrics();
  }

  private updateMetrics() {
    this.metrics = this.performanceService.analyzePerformance(this.code, this.language);
  }
} 