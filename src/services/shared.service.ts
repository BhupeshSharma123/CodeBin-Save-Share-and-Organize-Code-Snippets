import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
 
  codeBinToEdit: any;
  constructor() {}
  checkEdit: boolean = false;
  loginOrNotLoggedIn: boolean = false;
  checkData(loginData: any): any {
    // Check if there's any data in local storage for signup form
    const data = JSON.parse(localStorage.getItem('signup') || '{}');
    if (
      loginData.email === data.email &&
      loginData.password === data.password
    ) {
      return true;
    } else {
      return false;
    }
  }
  saveCodeBin(codeBin: any) {
    const codeBins = this.getCodeBins();
    codeBins.push(codeBin);
    localStorage.setItem('codeBins', JSON.stringify(codeBins));
  }

  // Retrieve code bins from localStorage
  getCodeBins(): any[] {
    return JSON.parse(localStorage.getItem('codeBins') || '[]');
  }
  setCodeBinToEdit(codeBin: any): void {
    this.codeBinToEdit = codeBin;
  }

  // Get the code bin to be edited
  getCodeBinToEdit(): any {
    return this.codeBinToEdit;
  }

  getCodeBinById(id: number): any {
    const codeBins = this.getCodeBins(); // Get all code bins
    return codeBins.find((bin) => bin.id === id) || null; // Return the matching bin or null
  }
}
