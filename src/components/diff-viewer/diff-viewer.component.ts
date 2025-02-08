import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiffService, DiffResult } from '../../app/services/diff.service';

@Component({
  selector: 'app-diff-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <!-- Header -->
      <div class="p-4 border-b dark:border-gray-700 flex justify-between items-center">
        <h3 class="text-lg font-semibold">Code Changes</h3>
        <div class="flex space-x-4 text-sm">
          <span class="text-green-600 dark:text-green-400">
            +{{ stats.additions }} additions
          </span>
          <span class="text-red-600 dark:text-red-400">
            -{{ stats.deletions }} deletions
          </span>
        </div>
      </div>

      <!-- Diff Display -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <tbody>
            <ng-container *ngFor="let change of diffResults; let i = index">
              <tr [ngClass]="{
                'bg-red-50 dark:bg-red-900/20': change.type === 'remove',
                'bg-green-50 dark:bg-green-900/20': change.type === 'add'
              }">
                <!-- Line Number -->
                <td class="text-gray-500 text-right pr-4 py-0.5 select-none w-12 border-r dark:border-gray-700">
                  {{ change.lineNumber }}
                </td>
                <!-- Code -->
                <td class="pl-4 py-0.5 font-mono whitespace-pre">
                  <ng-container [ngSwitch]="change.type">
                    <span *ngSwitchCase="'add'" class="text-green-600 dark:text-green-400">+</span>
                    <span *ngSwitchCase="'remove'" class="text-red-600 dark:text-red-400">-</span>
                    <span *ngSwitchDefault>&nbsp;</span>
                  </ng-container>
                  {{ change.value }}
                </td>
              </tr>
            </ng-container>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class DiffViewerComponent implements OnChanges {
  @Input() oldCode = '';
  @Input() newCode = '';
  
  diffResults: DiffResult[] = [];
  stats = { additions: 0, deletions: 0, changes: 0 };

  constructor(private diffService: DiffService) {}

  ngOnChanges() {
    this.updateDiff();
  }

  private updateDiff() {
    this.diffResults = this.diffService.computeDiff(this.oldCode, this.newCode);
    this.stats = this.diffService.getStats(this.diffResults);
  }
} 