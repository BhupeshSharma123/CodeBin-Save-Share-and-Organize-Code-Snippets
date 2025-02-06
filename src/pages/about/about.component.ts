import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class AboutComponent {
  teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'AI Research Lead',
      image: 'assets/team/sarah.jpg',
      socials: [
        { icon: 'fab fa-linkedin', url: '#' },
        { icon: 'fab fa-github', url: '#' },
        { icon: 'fab fa-twitter', url: '#' }
      ]
    },
    {
      name: 'Michael Chen',
      role: 'Lead Developer',
      image: 'assets/team/michael.jpg',
      socials: [
        { icon: 'fab fa-linkedin', url: '#' },
        { icon: 'fab fa-github', url: '#' }
      ]
    },
    {
      name: 'Emma Davis',
      role: 'Product Manager',
      image: 'assets/team/emma.jpg',
      socials: [
        { icon: 'fab fa-linkedin', url: '#' },
        { icon: 'fab fa-twitter', url: '#' }
      ]
    }
  ];
} 