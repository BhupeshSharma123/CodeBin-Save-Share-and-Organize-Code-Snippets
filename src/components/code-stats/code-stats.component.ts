import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsService, CodeStats } from '../../app/services/statistics.service';

@Component({
  selector: 'app-code-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <h3 class="text-lg font-semibold mb-4">Code Statistics</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div class="stat-item">
          <div class="text-sm text-gray-500">Lines of Code</div>
          <div class="text-xl font-bold">{{ stats.linesOfCode }}</div>
        </div>
        <div class="stat-item">
          <div class="text-sm text-gray-500">Functions</div>
          <div class="text-xl font-bold">{{ stats.functions }}</div>
        </div>
        <div class="stat-item">
          <div class="text-sm text-gray-500">Complexity</div>
          <div class="text-xl font-bold" [class.text-yellow-500]="stats.complexity > 10">
            {{ stats.complexity }}
          </div>
        </div>
        <div class="stat-item">
          <div class="text-sm text-gray-500">Duplicate Lines</div>
          <div class="text-xl font-bold" [class.text-red-500]="stats.duplicateLines > 0">
            {{ stats.duplicateLines }}
          </div>
        </div>
        <div class="stat-item">
          <div class="text-sm text-gray-500">Comments</div>
          <div class="text-xl font-bold">{{ stats.commentLines }}</div>
        </div>
        <div class="stat-item">
          <div class="text-sm text-gray-500">Maintainability</div>
          <div class="text-xl font-bold" [ngClass]="{
            'text-green-500': stats.maintainabilityIndex >= 80,
            'text-yellow-500': stats.maintainabilityIndex >= 60 && stats.maintainabilityIndex < 80,
            'text-red-500': stats.maintainabilityIndex < 60
          }">
            {{ stats.maintainabilityIndex }}%
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stat-item {
      @apply p-3 bg-gray-50 dark:bg-gray-700 rounded-lg;
    }
  `]
})
export class CodeStatsComponent implements OnChanges {
  @Input() code = '';
  @Input() language = 'javascript';
  stats!: CodeStats;

  constructor(private statisticsService: StatisticsService) {}

  ngOnChanges() {
    this.updateStats();
  }

  private updateStats() {
    this.stats = this.statisticsService.analyzeCode(this.code, this.language);
  }
} 