import { Component, OnInit } from '@angular/core';
import { MailService } from '../mail.service';
import { Mail } from '../mail';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mail-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mailview.component.html',
  styleUrls: ['./mailview.component.css']
})
export class MailViewComponent implements OnInit {
  mails: Mail[] = [];

  constructor(private mailService: MailService) {}

  getUncheckedMailCount(): number {
    return this.mails.filter(mail => !mail.isChecked).length;
  }

  async ngOnInit(): Promise<void> {
    await this.loadMails();
  }

  async loadMails(): Promise<void> {
    try {
      this.mails = await this.mailService.getInboxMails();
    } catch (error) {
      console.error('Error loading mails:', error);
    }
  }

  async updateMailStatus(mailId: number, isChecked: boolean): Promise<void> {
    try {
      await this.mailService.updateMailStatus(mailId, { isChecked });
      await this.loadMails();
    } catch (error) {
      console.error('Error updating mail status:', error);
    }
  }
}
