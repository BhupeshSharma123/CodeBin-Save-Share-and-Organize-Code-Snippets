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
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [ReactiveFormsModule, CommonModule],
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private service: SharedService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {}
  name = new FormControl('', [Validators.required]); // Creates a FormControl with an initial empty string value
  email = new FormControl('test@example.com', [
    Validators.required,
    Validators.email,
  ]);
  password = new FormControl('test@example.com', [
    Validators.required,
    Validators.minLength(5),
  ]);
  // Creates a FormControl with an initial value
  loginForm = new FormGroup({
    name: this.name,
    email: this.email,
    password: this.password,
  });
  login() {
    console.log(this.loginForm.value);
    console.log(this.service.checkData(this.loginForm.value));
    const loginCheck: boolean = this.service.checkData(this.loginForm.value);
    if (loginCheck) {
      this.service.loginOrNotLoggedIn = true;
      this.showSuccess();
      this.router.navigate(['/home']);
    } else {
      this.service.loginOrNotLoggedIn = false;
      alert('Login Failed');
    }
    console.log(this.service.loginOrNotLoggedIn);
  }

  // Creates a FormControl with initial value and disabled state
  reset() {
    this.loginForm.reset();
  }
  signUp() {
    this.router.navigate(['/signup']);
  }
  showSuccess() {
    this.toastr.success('Login Successfull');
  } // Creates a FormControl with initial value and disabled state
}
