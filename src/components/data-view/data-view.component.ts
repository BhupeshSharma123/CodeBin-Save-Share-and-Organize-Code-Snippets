import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../services/shared.service';

type CodeBin = {
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
  codeBins: CodeBin[] = [];
  timeStamp: any;
  values: any;

  constructor(
    private router: Router,
    private service: SharedService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadCodeBins();
    this.route.queryParams.subscribe((params) => {
      const timeStamp = params['timeStamp'];
      const editedValues: CodeBin = {
        id: Number(params['id']), // Convert to number
        title: params['title'],
        code: params['code'],
      };

      if (editedValues.id) {
        this.updateCodeBin(editedValues);
      }

      this.timeStamp = timeStamp;
      this.values = editedValues;
      console.log(this.values, 'Received edited values');
    });
  }

  loadCodeBins(): void {
    const storedData = localStorage.getItem('codeBins');
    this.codeBins = storedData ? JSON.parse(storedData) : [];
  }

  updateCodeBin(updatedBin: CodeBin): void {
    this.codeBins = this.codeBins.map((bin) =>
      bin.id === updatedBin.id ? updatedBin : bin
    );
    localStorage.setItem('codeBins', JSON.stringify(this.codeBins));
  }

  deleteCodeBin(id: number): void {
    this.codeBins = this.codeBins.filter((bin) => bin.id !== id);
    localStorage.setItem('codeBins', JSON.stringify(this.codeBins));
  }

  editCodeBin(id: number): void {
    this.service.checkEdit = true;
    const codeBin = this.codeBins.find((bin) => bin.id === id);

    if (codeBin) {
      this.service.setCodeBinToEdit(codeBin); // Store in service
      this.router.navigate(['/edit', id]); // Navigate to edit page
    } else {
      console.error('Code bin not found!');
    }
  }

  createBin() {
    this.router.navigate(['/bin']);
  }
}
