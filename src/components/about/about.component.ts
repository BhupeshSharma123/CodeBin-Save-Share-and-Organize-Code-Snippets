// about.component.ts
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  // You can add component logic here
  teamMembers = [
    { name: 'John Doe', role: 'CEO', bio: 'Founder and visionary leader' },
    { name: 'Jane Smith', role: 'CTO', bio: 'Technology expert and innovator' },
    { name: 'Mike Johnson', role: 'Designer', bio: 'Creative design specialist' }
  ];

  features = [
    'Easy to use interface',
    'Secure data storage',
    'Cross-platform compatibility',
    'Regular updates and improvements'
  ];
}