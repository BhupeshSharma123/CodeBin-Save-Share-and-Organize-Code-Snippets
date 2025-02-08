import { Injectable } from '@angular/core';
import { diffLines } from 'diff';

export interface DiffResult {
  type: 'add' | 'remove' | 'unchanged';
  value: string;
  lineNumber?: number;
}

@Injectable({
  providedIn: 'root',
})
export class DiffService {
  computeDiff(oldCode: string, newCode: string): DiffResult[] {
    const changes = diffLines(oldCode, newCode);
    let lineNumber = 1;

    return changes.map((change: any) => {
      const result: DiffResult = {
        type: change.added ? 'add' : change.removed ? 'remove' : 'unchanged',
        value: change.value,
        lineNumber: lineNumber,
      };

      if (!change.removed) {
        lineNumber += change.count || 0;
      }

      return result;
    });
  }

  formatDiff(diffResults: DiffResult[]): string {
    return diffResults
      .map((result) => {
        const prefix =
          result.type === 'add' ? '+' : result.type === 'remove' ? '-' : ' ';
        return result.value
          .split('\n')
          .map((line) => (line ? `${prefix} ${line}` : ''))
          .join('\n');
      })
      .join('\n');
  }

  getStats(diffResults: DiffResult[]) {
    return {
      additions: diffResults.filter((r) => r.type === 'add').length,
      deletions: diffResults.filter((r) => r.type === 'remove').length,
      changes: diffResults.filter((r) => r.type !== 'unchanged').length,
    };
  }
}
