import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SupabaseService } from '../../app/services/supabase.service';
import { take } from 'rxjs/operators';
import { RouterLink } from '@angular/router';

import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../app/navbar/navbar.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [ReactiveFormsModule, CommonModule, RouterLink, NavbarComponent],
  styleUrls: ['./login.component.css'],
  standalone: true,
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    private toastr: ToastrService,
    private supabaseService: SupabaseService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Check if user is already logged in
    this.supabaseService.user$.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.router.navigate(['/home']);
      }
    });
  }

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
  ]);

  loginForm = new FormGroup({
    email: this.email,
    password: this.password,
  });
  forgetPassword = false;
  async login() {
    // Check if the form is valid
    if (this.loginForm.valid) {
      try {
        // Extract email and password from the form
        const { email, password } = this.loginForm.value;

        // Ensure email and password are not null or undefined
        if (!email || !password) {
          this.toastr.error('Email and password are required.');
          return;
        }

        // Attempt to sign in using SupabaseService
        await this.supabaseService.signIn(email, password);

        // Show success message
        this.toastr.success('Login Successful');

        // Navigate to the home page after successful login
        const returnUrl =
          this.route.snapshot.queryParams['returnUrl'] || '/home';
        await this.router.navigateByUrl(returnUrl);
      } catch (error: any) {
        // Log the error for debugging purposes
        console.error('Login error:', error);

        // Show a user-friendly error message
        this.toastr.error(error.message ?? 'Login failed. Please try again.');
      }
    } else {
      // Provide feedback if the form is invalid
      this.toastr.error('Please fill in all required fields correctly.');

      // Optionally, mark all form controls as touched to display validation messages
      this.loginForm.markAllAsTouched();
    }
  }

  async requestPasswordReset() {
    this.forgetPassword = true;
    const email = this.email.value;
    if (email) {
      try {
        await this.supabaseService.resetPassword(email);
        this.toastr.success('Password reset email sent');
      } catch (error) {
        this.toastr.error('Error sending password reset email');
        console.error('Error:', error);
      }
      this.forgetPassword = false;
    } else {
      this.toastr.error('Please enter your email to reset password');
    }
  }

  signUp() {
    this.router.navigate(['/signup']);
  }

  reset() {
    this.loginForm.reset();
  }
}
