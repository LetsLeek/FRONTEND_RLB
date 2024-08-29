import { Component, OnInit, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CheckService } from '../check.service';
import { Check } from '../check';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-check-protocol-table',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './check-protocol-table.component.html',
  styleUrls: ['./check-protocol-table.component.css']
})
export class CheckProtocolTableComponent implements OnInit, OnChanges {
  @Input() department: string | undefined;
  checkList: Check[] = [];
  sortDirection: 'asc' | 'desc' = 'asc';
  sortColumn: string = 'name';
  private checkService = inject(CheckService);
  private authService = inject(AuthService);

  userInfo = { 
    "isAdmin": this.authService.getRole() === "Admin" ? true : false, 
    "department": this.authService.getDepartment()
  }; 
  progressValue: number = 0;

  constructor() {}

  async ngOnInit() {
    await this.loadChecks();
    this.sortChecks('date');
  }

  sortChecks(column: string): void {
    // Toggle sort direction if the same column is clicked
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'desc'; // Default to descending when changing columns
    }
  
    // Sort the array
    this.checkList.sort((a: any, b: any) => {
      let valueA: string | number = '';
      let valueB: string | number = '';
  
      // Adjust sorting logic based on the column
      switch (column) {
        case 'date':
          valueA = a.date.toLowerCase();
          valueB = b.date.toLowerCase();
          break;
        case 'remark':
          valueA = a.remark?.toLowerCase() || '';
          valueB = b.remark?.toLowerCase() || '';
          break;
        case 'state':
          valueA = a.state?.toLowerCase() || '';
          valueB = b.state?.toLowerCase() || '';
          break;
      }
  
      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      } else if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }
  

  getProgressValue(checkId: number): number {
    const check: Check | undefined = this.checkList.find(check => check.id === checkId);

    const countCheckedKeywords = check?.keyWords.reduce((acc, cur) => {
      if (cur.checkedBy?.person != null) {
        return acc + 1;
      }
      return acc;
    }, 0) ?? 1;
  
    const countTotalKeywords = check?.keyWords.length ?? 0; // Verhindert Division durch null
    
    const progressValue = parseFloat(((countCheckedKeywords / countTotalKeywords) * 100).toFixed(2));

    return progressValue;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['department']) {
      this.loadChecks();
    }
  }

  async loadChecks(): Promise<void> {
    if (this.department) {
      try {
        this.checkList = await this.checkService.getChecks(this.department);
      } catch (err) {
        console.error('Error fetching checks', err);
      }
    }
  }
}
