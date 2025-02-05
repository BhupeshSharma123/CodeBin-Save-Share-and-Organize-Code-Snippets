import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SupabaseService } from '../../app/services/supabase.service';

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
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  styleUrls: ['./signup.component.css'],
  standalone: true,
})
export class SignupComponent {
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private supabaseService: SupabaseService
  ) {}

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);
  confirmPassword = new FormControl('', [Validators.required]);

  signupForm = new FormGroup({
    email: this.email,
    password: this.password,
    confirmPassword: this.confirmPassword,
  });

  async signup() {
    if (this.signupForm.valid) {
      const { email, password, confirmPassword } = this.signupForm.value;

      if (password !== confirmPassword) {
        this.toastr.error('Passwords do not match');
        return;
      }

      try {
        await this.supabaseService.signUp(email!, password!);
        this.toastr.success(
          'Signup successful! Please check your email to confirm your account.'
        );
        await this.router.navigate(['/login']);
      } catch (error: any) {
        console.error('Signup error:', error);
        this.toastr.error(error.message || 'Signup failed. Please try again.');
      }
    } else {
      this.toastr.error('Please fill in all required fields correctly');
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
