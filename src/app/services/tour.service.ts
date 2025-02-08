import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface TourStep {
  target: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  order: number;
}

@Injectable({
  providedIn: 'root'
})
export class TourService {
  private currentStepSubject = new BehaviorSubject<number>(0);
  currentStep$ = this.currentStepSubject.asObservable();

  private readonly steps: TourStep[] = [
    {
      target: '[data-tour="ai-assistant"]',
      title: 'AI Assistant',
      content: 'Generate code using AI. Just describe what you want to create!',
      position: 'bottom',
      order: 1
    },
    {
      target: '[data-tour="code-editor"]',
      title: 'Code Editor',
      content: 'Write and edit your code here. Supports multiple languages!',
      position: 'right',
      order: 2
    },
    {
      target: '[data-tour="snippets"]',
      title: 'Code Snippets',
      content: 'Save and organize your code snippets for quick access.',
      position: 'left',
      order: 3
    },
    {
      target: '[data-tour="performance"]',
      title: 'Performance Metrics',
      content: 'Analyze your code for performance issues and best practices.',
      position: 'top',
      order: 4
    }
  ];

  private isActive = false;

  startTour() {
    this.isActive = true;
    this.currentStepSubject.next(1);
  }

  nextStep() {
    const current = this.currentStepSubject.value;
    if (current < this.steps.length) {
      this.currentStepSubject.next(current + 1);
    } else {
      this.endTour();
    }
  }

  previousStep() {
    const current = this.currentStepSubject.value;
    if (current > 1) {
      this.currentStepSubject.next(current - 1);
    }
  }

  endTour() {
    this.isActive = false;
    this.currentStepSubject.next(0);
  }

  getCurrentStep(): TourStep | null {
    const index = this.currentStepSubject.value - 1;
    return index >= 0 ? this.steps[index] : null;
  }

  isActiveTour(): boolean {
    return this.isActive;
  }
} 