import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedService } from '../../services/shared.service';

interface CodeBin {
  id: string;
  title: string;
  code: string;
  date: Date;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [RouterLink, CommonModule],
})
export class HomeComponent implements OnInit {
  recentBins: CodeBin[] = [];

  constructor(public service: SharedService) {}

  ngOnInit(): void {
    this.service.loginOrNotLoggedIn = true;
    this.recentBins = this.service.getCodeBins();
  }
}
