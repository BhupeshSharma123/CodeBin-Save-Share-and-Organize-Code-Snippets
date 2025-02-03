import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-code-bin',
  templateUrl: './code-bin.component.html',
  styleUrls: ['./code-bin.component.css'],
  standalone: true, // Needed for standalone component
  imports: [ReactiveFormsModule, CommonModule],
})
export class CodeBinComponent implements OnInit {
  constructor(private router: Router, public service: SharedService) {}

  title = new FormControl('', [Validators.required]);
  code = new FormControl('', [Validators.required]);
  binForm = new FormGroup({
    title: this.title,
    code: this.code,
  });

  editUserData: any | null = null;
  timestamp: Date = new Date(); // Initialize timestamp
  editedValues: any = {
    id: '',
    title: '',
    code: '',
  };

  onSubmit() {
    if (this.binForm.valid) {
      if (this.router.url.includes('edit') && this.editUserData) {
        // Use existing ID for edited entries
        this.editedValues = {
          id: this.editUserData.id,
          ...this.binForm.value,
        };
      } else {
        // Create a new entry with a unique ID
        this.editedValues = {
          id: Date.now(),
          ...this.binForm.value,
        };
      }

      this.service.saveCodeBin(this.editedValues);
      this.timestamp = new Date();
      console.log('Saved CodeBin:', this.editedValues);
    }
  }

  onViewSubmit() {
    if (this.binForm.valid) {
      this.router.navigate(['/view'], {
        queryParams: {
          timeStamp: this.timestamp.toISOString(),
          id: this.editedValues.id,
          title: this.editedValues.title,
          code: this.editedValues.code,
        },
      });

      console.log('Navigating with:', this.editedValues);
    }
  }

  ngOnInit() {
    this.editUserData = this.service.getCodeBinToEdit();

    if (this.router.url.includes('edit') && this.editUserData) {
      this.binForm.patchValue({
        title: this.editUserData.title,
        code: this.editUserData.code,
      });
    } else {
      this.binForm.reset();
    }
  }
}
