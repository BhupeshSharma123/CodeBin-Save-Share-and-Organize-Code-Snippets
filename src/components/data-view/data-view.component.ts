import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';
type codeBins = {
  id: number;
  title: string;
  code: string;
};
@Component({
  selector: 'app-data-view',
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.css'],
  imports: [CommonModule],
})
export class DataViewComponent implements OnInit {
  codeBins: codeBins[] = [];
  constructor(
    private router: Router,
    private service: SharedService,
    private route: ActivatedRoute
  ) {}
  timeStamp: any;
  values: any;
  ngOnInit() {
    this.loadCodeBins();
    this.route.queryParams.subscribe((params) => {
      const timeStamp = params['timeStamp'];
      const editedValues = params['editedValues'];
      this.timeStamp = timeStamp;
      this.values = editedValues;
      // Example: 1 'active'
      console.log(this.timeStamp);
      
    });
  }
  loadCodeBins(): void {
    const storedData = localStorage.getItem('codeBins');
    this.codeBins = storedData ? JSON.parse(storedData) : [];
  }

  deleteCodeBin(id: number): void {
    this.codeBins = this.codeBins.filter((bin) => bin.id !== id);
    localStorage.setItem('codeBins', JSON.stringify(this.codeBins));
  }

  // Navigate to edit page
  editCodeBin(id: number): void {
    this.service.checkEdit = true;
    const codeBin = this.service.getCodeBinById(id);
    console.log('codeBin', codeBin);
    if (codeBin) {
      this.service.setCodeBinToEdit(codeBin); // Store the code bin in the service
      this.router.navigate(['/edit', id]); // Navigate to the edit page
    } else {
      console.error('Code bin not found!');
    }
  }
  createBin() {
    this.router.navigate(['/bin']);
  }
}
