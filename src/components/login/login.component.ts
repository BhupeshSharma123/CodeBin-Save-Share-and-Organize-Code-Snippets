import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [ReactiveFormsModule, CommonModule],
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor() {}

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
  } // Creates a FormControl with initial value and disabled state
  reset() {
    this.loginForm.reset();
  } // Creates a FormControl with initial value and disabled state
}
