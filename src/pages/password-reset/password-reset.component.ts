import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { SupabaseService } from '../../app/services/supabase.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css'],
})
export class PasswordResetComponent implements OnInit {
  resetForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: [''],
    });
  }

  ngOnInit() {
    // Check for access token in the URL
    const accessToken = this.route.snapshot.queryParamMap.get('access_token');
    if (!accessToken) {
      this.toastr.error('Invalid or missing access token');
      this.router.navigate(['/reset-password']);
    }
  }

  async resetPassword() {
    if (this.resetForm.valid) {
      const { password, confirmPassword } = this.resetForm.value;
      if (password !== confirmPassword) {
        this.toastr.error('Passwords do not match');
        return;
      }

      this.isLoading = true;
      try {
        await this.supabaseService.updatePassword(password);
        this.toastr.success('Password reset successfully');
        this.router.navigate(['/login']);
      } catch (error) {
        this.toastr.error('Error resetting password');
        console.error('Error:', error);
      } finally {
        this.isLoading = false;
      }
    }
  }
}
