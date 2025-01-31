import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedService } from '../../services/shared.service';

interface CodeBin {
  id: string;
  title: string;
  description?: string;
  date: Date;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [RouterLink, CommonModule],
})
export class HomeComponent implements OnInit {
  recentBins: CodeBin[] = [
    {
      id: '1',
      title: 'React Todo App',
      description: 'A simple todo app built with React and Tailwind CSS.',
      date: new Date('2023-10-01'),
    },
    {
      id: '2',
      title: 'Node.js API Example',
      description: 'A basic REST API built with Node.js and Express.',
      date: new Date('2023-09-25'),
    },
    {
      id: '3',
      title: 'Angular Form Validation',
      description: 'Example of reactive form validation in Angular.',
      date: new Date('2023-09-20'),
    },
  ];

  constructor(public service: SharedService) {}

  ngOnInit(): void {
    this.service.loginOrNotLoggedIn = true;
  }
}
