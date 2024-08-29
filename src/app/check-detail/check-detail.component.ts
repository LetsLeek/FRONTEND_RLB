import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CheckService } from '../check.service';
import { Check } from '../check';
import { CommonModule } from '@angular/common';
import { Keyword } from '../keyword';
import { AuthService } from '../auth.service';
import { KeywordService } from '../keyword.service';

@Component({
  selector: 'app-check-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './check-detail.component.html',
  styleUrls: ['./check-detail.component.css']
})
export class CheckDetailComponent implements OnInit {
  checkId: number = -1;
  checkDep: string | undefined;
  check: Check | undefined;
  checkDate: string | undefined;
  isModalVisible: boolean = false;
  selectedKeyword: Keyword | null = null;

  private checkService = inject(CheckService);
  private keywordService = inject(KeywordService);
  private route = inject(ActivatedRoute);

  constructor(private authService: AuthService) {}

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(params => {
      this.checkId = Number(params['id']);
    });

    this.route.queryParams.subscribe(queryParams => {
      this.checkDep = queryParams['dep'];
    });

    if (this.checkId !== -1 && this.checkDep) {
      await this.loadCheckDetails();
    } else {
      console.error('Check ID or Department is missing');
    }
  }

  isAdmin(): boolean {
    return this.authService.getRole() === 'Admin';
  }

  private async loadCheckDetails(): Promise<void> {
    try {
      this.check = await this.checkService.getCheckById(this.checkId, this.checkDep!);
      this.checkDate = this.check?.date.split(' ')[0];
    } catch (err) {
      console.error('Error fetching check details', err);
    }
  }

  getCheckProgress(): number {
    const totalKeywords = this.check?.keyWords.length ?? 0;
    const checkedKeywords = this.check?.keyWords.filter(kw => kw.checkedBy?.person != null).length ?? 0;

    return totalKeywords > 0 ? parseFloat(((checkedKeywords / totalKeywords) * 100).toFixed(2)) : 0;
  }

  openModal(keyword: Keyword): void {
    if (this.isAdmin() && this.authService.getDepartment() == this.check?.department) {
      this.selectedKeyword = keyword;
      this.isModalVisible = true;
    }  
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.selectedKeyword = null; // Modal schließen und ausgewähltes Keyword zurücksetzen
  }

  async confirmCheck(pickedTime: string): Promise<void> {
    if (!pickedTime) {
      console.error('No time selected');
      return;
    }

    if (!this.selectedKeyword || !this.check) {
      console.error('No keyword selected or check data is missing');
      return;
    }

    // Initialisiere checkedBy, falls es noch nicht vorhanden ist
    this.selectedKeyword.checkedBy = this.selectedKeyword.checkedBy || {};

    // Setze das Datum und die Person, die das Keyword überprüft hat
    this.selectedKeyword.checkedBy.date = `${this.checkDate} ${pickedTime}:00`;

    this.selectedKeyword.checkedBy.person = (await this.keywordService.getAllPersons(this.authService.getDepartment() ?? "")).find(person => person.email == this.authService.getCurrentUser()?.email);
  
    try {
      // Aktualisiere den Check und schließe das Modal
      await this.checkService.updateCheck(this.check);
      
      this.closeModal();
    } catch (err) {
      console.error('Error confirming check:', err);
      this.closeModal(); //err beseitigen
    }
  }
}
