import { Injectable } from '@angular/core';

export interface CodeStats {
  linesOfCode: number;
  functions: number;
  complexity: number;
  duplicateLines: number;
  commentLines: number;
  maintainabilityIndex: number;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  analyzeCode(code: string, language: string): CodeStats {
    return {
      linesOfCode: this.countLines(code),
      functions: this.countFunctions(code, language),
      complexity: this.calculateComplexity(code, language),
      duplicateLines: this.findDuplicates(code),
      commentLines: this.countComments(code, language),
      maintainabilityIndex: this.calculateMaintainability(code)
    };
  }

  private countLines(code: string): number {
    return code.split('\n').filter(line => line.trim().length > 0).length;
  }

  private countFunctions(code: string, language: string): number {
    const patterns = {
      javascript: /function\s+\w+\s*\(|const\s+\w+\s*=\s*(\([^)]*\)|async\s*\([^)]*\))\s*=>/g,
      typescript: /function\s+\w+\s*\(|const\s+\w+\s*=\s*(\([^)]*\)|async\s*\([^)]*\))\s*=>/g,
      python: /def\s+\w+\s*\(/g,
      java: /(\w+\s+)*\w+\s+\w+\s*\([^)]*\)\s*({|throws)/g
    };

    const pattern = patterns[language as keyof typeof patterns] || patterns.javascript;
    const matches = code.match(pattern);
    return matches ? matches.length : 0;
  }

  private calculateComplexity(code: string, language: string): number {
    // Basic cyclomatic complexity calculation
    const patterns = {
      if: /if\s*\(/g,
      for: /for\s*\(/g,
      while: /while\s*\(/g,
      catch: /catch\s*\(/g,
      switch: /switch\s*\(/g,
      case: /case\s+.+:/g,
      ternary: /\?.*:/g
    };

    let complexity = 1; // Base complexity
    Object.values(patterns).forEach(pattern => {
      const matches = code.match(pattern);
      if (matches) {
        complexity += matches.length;
      }
    });

    return complexity;
  }

  private findDuplicates(code: string): number {
    const lines = code.split('\n').map(line => line.trim());
    const duplicates = new Set<string>();
    
    for (let i = 0; i < lines.length - 3; i++) {
      const chunk = lines.slice(i, i + 3).join('\n');
      if (chunk.length > 10) { // Ignore very short chunks
        const count = code.split(chunk).length - 1;
        if (count > 1) {
          duplicates.add(chunk);
        }
      }
    }

    return duplicates.size;
  }

  private countComments(code: string, language: string): number {
    const patterns = {
      singleLine: {
        javascript: /\/\/.*/g,
        typescript: /\/\/.*/g,
        python: /#.*/g,
        java: /\/\/.*/g
      },
      multiLine: {
        javascript: /\/\*[\s\S]*?\*\//g,
        typescript: /\/\*[\s\S]*?\*\//g,
        python: /'''[\s\S]*?'''|"""[\s\S]*?"""/g,
        java: /\/\*[\s\S]*?\*\//g
      }
    };

    const lang = language as keyof typeof patterns.singleLine;
    const singleLineComments = code.match(patterns.singleLine[lang] || patterns.singleLine.javascript);
    const multiLineComments = code.match(patterns.multiLine[lang] || patterns.multiLine.javascript);

    return (singleLineComments?.length || 0) + (multiLineComments?.length || 0);
  }

  private calculateMaintainability(code: string): number {
    const halsteadVolume = this.calculateHalsteadVolume(code);
    const cyclomaticComplexity = this.calculateComplexity(code, 'javascript');
    const linesOfCode = this.countLines(code);

    // Maintainability Index formula
    const maintainability = Math.max(0, (171 - 5.2 * Math.log(halsteadVolume) - 0.23 * cyclomaticComplexity - 16.2 * Math.log(linesOfCode)) * 100 / 171);
    
    return Math.round(maintainability);
  }

  private calculateHalsteadVolume(code: string): number {
    const operators = new Set();
    const operands = new Set();
    
    // Simple tokenization
    const tokens = code.match(/[a-zA-Z_]\w*|[+\-*/=<>!&|^~%]+|\d+/g) || [];
    
    tokens.forEach(token => {
      if (token.match(/[+\-*/=<>!&|^~%]+/)) {
        operators.add(token);
      } else {
        operands.add(token);
      }
    });

    const n1 = operators.size;
    const n2 = operands.size;
    const N1 = tokens.filter(t => t.match(/[+\-*/=<>!&|^~%]+/)).length;
    const N2 = tokens.filter(t => !t.match(/[+\-*/=<>!&|^~%]+/)).length;

    return (N1 + N2) * Math.log2(n1 + n2);
  }
} 