import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tag-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex flex-wrap gap-2 p-2 border rounded-lg">
      <div *ngFor="let tag of tags" 
           class="flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
        {{ tag }}
        <button (click)="removeTag(tag)" class="ml-2 text-sm">&times;</button>
      </div>
      
      <input type="text" 
             [(ngModel)]="newTag"
             (keyup.enter)="addTag()"
             placeholder="Add tag..."
             class="outline-none border-none bg-transparent" />
    </div>
  `
})
export class TagInputComponent {
  @Input() tags: string[] = [];
  @Output() tagsChange = new EventEmitter<string[]>();
  
  newTag = '';

  addTag() {
    if (this.newTag.trim() && !this.tags.includes(this.newTag.trim())) {
      this.tags = [...this.tags, this.newTag.trim()];
      this.tagsChange.emit(this.tags);
      this.newTag = '';
    }
  }

  removeTag(tagToRemove: string) {
    this.tags = this.tags.filter(tag => tag !== tagToRemove);
    this.tagsChange.emit(this.tags);
  }
} 