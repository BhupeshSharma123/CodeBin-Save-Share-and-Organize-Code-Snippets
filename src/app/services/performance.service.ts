import { Injectable } from '@angular/core';

export interface PerformanceMetric {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  suggestion: string;
  lineNumber?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  analyzePerformance(code: string, language: string): PerformanceMetric[] {
    const metrics: PerformanceMetric[] = [];

    // Time Complexity Analysis
    this.analyzeTimeComplexity(code, metrics);

    // Memory Usage Analysis
    this.analyzeMemoryUsage(code, metrics);

    // Best Practices Check
    this.checkBestPractices(code, language, metrics);

    return metrics;
  }

  private analyzeTimeComplexity(code: string, metrics: PerformanceMetric[]) {
    // Nested Loops Detection
    const nestedLoops = (code.match(/for.*\s*for|while.*\s*while/g) || []).length;
    if (nestedLoops > 0) {
      metrics.push({
        type: 'Time Complexity',
        description: `Found ${nestedLoops} nested loops`,
        severity: nestedLoops > 2 ? 'high' : 'medium',
        suggestion: 'Consider using more efficient data structures or algorithms to avoid nested iterations'
      });
    }

    // Recursive Function Detection
    if (code.includes('function') && code.match(/\w+\s*\([^)]*\)\s*{[\s\S]*?\1\s*\(/)) {
      metrics.push({
        type: 'Time Complexity',
        description: 'Recursive function detected',
        severity: 'medium',
        suggestion: 'Ensure proper base cases and consider iterative alternatives for deep recursions'
      });
    }
  }

  private analyzeMemoryUsage(code: string, metrics: PerformanceMetric[]) {
    // Large Array Operations
    const arrayOps = code.match(/new Array\(\d+\)|Array\(\d+\)|new Array\s*\[\]/g);
    if (arrayOps) {
      metrics.push({
        type: 'Memory Usage',
        description: 'Large array operations detected',
        severity: 'medium',
        suggestion: 'Consider streaming or pagination for large data sets'
      });
    }

    // Memory Leaks in Closures
    if (code.includes('addEventListener') && !code.includes('removeEventListener')) {
      metrics.push({
        type: 'Memory Usage',
        description: 'Potential memory leak in event listeners',
        severity: 'high',
        suggestion: 'Remember to remove event listeners when they are no longer needed'
      });
    }
  }

  private checkBestPractices(code: string, language: string, metrics: PerformanceMetric[]) {
    // Async Operations
    if (code.includes('async') && !code.includes('try') && !code.includes('catch')) {
      metrics.push({
        type: 'Best Practices',
        description: 'Async operations without error handling',
        severity: 'high',
        suggestion: 'Add try-catch blocks around async operations'
      });
    }

    // Language-specific checks
    switch (language) {
      case 'javascript':
      case 'typescript':
        this.checkJavaScriptPractices(code, metrics);
        break;
      case 'python':
        this.checkPythonPractices(code, metrics);
        break;
    }
  }

  private checkJavaScriptPractices(code: string, metrics: PerformanceMetric[]) {
    // Console.log in production
    if (code.includes('console.log')) {
      metrics.push({
        type: 'Best Practices',
        description: 'Console.log statements found',
        severity: 'low',
        suggestion: 'Remove console.log statements in production code'
      });
    }

    // Array method chaining
    const chainedMethods = code.match(/\.map\(.*\)\.filter\(|\.filter\(.*\)\.map\(/g);
    if (chainedMethods) {
      metrics.push({
        type: 'Performance',
        description: 'Multiple array iterations',
        severity: 'medium',
        suggestion: 'Consider combining map and filter operations to reduce iterations'
      });
    }
  }

  private checkPythonPractices(code: string, metrics: PerformanceMetric[]) {
    // List comprehension vs loops
    if (code.includes('for') && code.includes('append')) {
      metrics.push({
        type: 'Performance',
        description: 'Loop with list append',
        severity: 'low',
        suggestion: 'Consider using list comprehension for better performance'
      });
    }

    // Global variables
    if (code.includes('global ')) {
      metrics.push({
        type: 'Best Practices',
        description: 'Global variables usage',
        severity: 'medium',
        suggestion: 'Avoid using global variables, use class attributes or function parameters instead'
      });
    }
  }
} 