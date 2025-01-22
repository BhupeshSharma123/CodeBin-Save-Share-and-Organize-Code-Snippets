import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
function mustMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.parent?.get('password');
  const confirmPassword = control;

  if (!password || !confirmPassword) {
    return null;
  }

  if (password.value !== confirmPassword.value) {
    return { mustMatch: true };
  }

  return null;
}
@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}
  username = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);
  confirmPassword = new FormControl('', [Validators.required, mustMatch]);
  // Creates a FormControl with an initial value
  signupForm = new FormGroup({
    username: this.username,
    email: this.email,
    password: this.password,
    confirmPassword: this.confirmPassword,
  });
  signup() {
    if (this.signupForm.valid) {
      console.log(this.signupForm.value);
      localStorage.setItem('signup', JSON.stringify(this.signupForm.value));
      this.router.navigate(['/login']);
    }
  }

  reset() {
    this.signupForm.reset();
  } // Creates a
}
