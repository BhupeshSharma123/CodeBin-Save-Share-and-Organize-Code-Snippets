import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourService, TourStep } from '../../app/services/tour.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tour-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="currentStep" class="fixed inset-0 z-50">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>

      <!-- Tour Popup -->
      <div
        class="absolute bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm"
        [style.top.px]="popupPosition.top"
        [style.left.px]="popupPosition.left"
      >
        <h3 class="text-lg font-semibold mb-2">{{ currentStep.title }}</h3>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          {{ currentStep.content }}
        </p>

        <div class="flex justify-between items-center">
          <div class="space-x-2">
            <button
              (click)="previousStep()"
              [disabled]="isFirstStep"
              class="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              (click)="nextStep()"
              class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {{ isLastStep ? 'Finish' : 'Next' }}
            </button>
          </div>
          <span class="text-sm text-gray-500">
            Step {{ stepNumber }}/{{ totalSteps }}
          </span>
        </div>
      </div>
    </div>
  `,
})
export class TourOverlayComponent implements OnInit, OnDestroy {
  currentStep: TourStep | null = null;
  stepNumber = 1;
  totalSteps = 4;
  private subscription: Subscription | null = null;

  constructor(private tourService: TourService) {}

  ngOnInit() {
    this.subscription = this.tourService.currentStep$.subscribe((step) => {
      this.currentStep = this.tourService.getCurrentStep();
      this.stepNumber = step;
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  get isFirstStep(): boolean {
    return this.stepNumber === 1;
  }

  get isLastStep(): boolean {
    return this.stepNumber === this.totalSteps;
  }

  nextStep() {
    if (this.isLastStep) {
      this.tourService.endTour();
    } else {
      this.tourService.nextStep();
    }
  }

  previousStep() {
    this.tourService.previousStep();
  }

  get popupPosition() {
    if (!this.currentStep) return { top: 0, left: 0 };

    const targetElement = document.querySelector(this.currentStep.target);
    if (!targetElement) return { top: 0, left: 0 };

    const rect = targetElement.getBoundingClientRect();
    const position = { top: 0, left: 0 };

    switch (this.currentStep.position) {
      case 'top':
        position.top = rect.top - 200;
        position.left = rect.left + rect.width / 2 - 200;
        break;
      case 'bottom':
        position.top = rect.bottom + 20;
        position.left = rect.left + rect.width / 2 - 200;
        break;
      case 'left':
        position.top = rect.top + rect.height / 2 - 100;
        position.left = rect.left - 420;
        break;
      case 'right':
        position.top = rect.top + rect.height / 2 - 100;
        position.left = rect.right + 20;
        break;
    }

    return position;
  }
}
