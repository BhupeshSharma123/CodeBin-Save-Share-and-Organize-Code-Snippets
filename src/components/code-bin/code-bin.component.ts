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
  imports: [ReactiveFormsModule, CommonModule],
})
export class CodeBinComponent implements OnInit {
  constructor(private router: Router, public service: SharedService) {
    console.log('Home', this.service.loginOrNotLoggedIn);
  }
  title = new FormControl('', [Validators.required]);
  code = new FormControl('', [Validators.required]);
  binForm = new FormGroup({
    title: this.title,
    code: this.code,
  });
  editUserData: any;
  timestamp: Date = new Date(); // Initialize timestamp
  editedValues: any = {
    id: '',
    title: '',
    code: '',
  };
  onSubmit() {
    if (this.binForm.valid) {
      if (this.router.url.includes('edit')) {
        this.editedValues.id = this.editUserData.id;
        this.editedValues.title = this.binForm.value.title;
        this.editedValues.code = this.binForm.value.code;
        this.title.setValue(this.editedValues.title);
        this.code.setValue(this.editedValues.code);
        console.log('this.editableValue', this.editedValues);
      }
      const newCodeBin = {
        id: Date.now(), // Use timestamp as a unique ID
        ...this.binForm.value,
      };
      this.service.saveCodeBin(newCodeBin);
      this.timestamp = new Date();
    }
  }
  onViewSubmit() {
    if (this.binForm.valid) {
      console.log('View submitted:', this.binForm.value);
      this.router.navigate(['/view'], {
        queryParams: {
          timeStamp: this.timestamp,
          editedValues: this.editedValues,
        },
      });
      // Add your submission logic here
      console.log(this.editedValues,"adhagfdvbadca");
    }
  }
  ngOnInit() {
    this.editUserData = this.service.getCodeBinToEdit();
    console.log('editUserData', this.editUserData);
    if (this.router.url.includes('edit')) {
      this.binForm.patchValue({
        title: this.editUserData.title,
        code: this.editUserData.code,
      });
    } else {
      this.binForm.reset();
    }
  }
}
