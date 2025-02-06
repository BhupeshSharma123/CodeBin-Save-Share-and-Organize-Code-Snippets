import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private codeBinToEdit: any = null;
  checkEdit: boolean = false;
  loginOrNotLoggedIn: boolean = false;
  private refreshSnippetsSource = new Subject<void>();
  refreshSnippets$ = this.refreshSnippetsSource.asObservable();

  constructor() {}

  // Check login data against stored signup data
  checkData(loginData: any): boolean {
    const data = JSON.parse(localStorage.getItem('signup') || '{}');
    return (
      loginData.email === data.email && loginData.password === data.password
    );
  }

  // Save or update a code bin
  saveCodeBin(codeBin: any): void {
    let codeBins = this.getCodeBins();
    const index = codeBins.findIndex((bin) => bin.id === codeBin.id);

    if (index !== -1) {
      // If the bin exists, update it
      codeBins[index] = codeBin;
    } else {
      // If it's new, add it
      codeBins.push(codeBin);
    }

    localStorage.setItem('codeBins', JSON.stringify(codeBins));
  }

  // Retrieve all code bins
  getCodeBins(): any[] {
    return JSON.parse(localStorage.getItem('codeBins') || '[]');
  }

  // Set code bin to be edited
  setCodeBinToEdit(codeBin: any): void {
    this.codeBinToEdit = codeBin;
    localStorage.setItem('codeBinToEdit', JSON.stringify(this.codeBinToEdit));
  }

  // Get the code bin to be edited
  getCodeBinToEdit(): any {
    const storedBin = localStorage.getItem('codeBinToEdit');
    return storedBin ? JSON.parse(storedBin) : null;
  }

  // Get a specific code bin by ID
  getCodeBinById(id: number): any {
    return this.getCodeBins().find((bin) => bin.id === id) || null;
  }

  refreshSnippets() {
    this.refreshSnippetsSource.next();
  }
}
