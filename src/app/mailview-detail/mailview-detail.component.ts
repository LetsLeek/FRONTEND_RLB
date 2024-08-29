import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MailService } from '../mail.service';
import { CheckService } from '../check.service';
import { Mail } from '../mail';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mailview-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mailview-detail.component.html',
  styleUrls: ['./mailview-detail.component.css']
})
export class MailViewDetailComponent implements OnInit {
  mail: Mail | undefined;
  isModalVisible: boolean = false;
  private user: string = 'Mathias Gombos'; // Beispielname

  constructor(
    private route: ActivatedRoute,
    private mailService: MailService,
    private checkService: CheckService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    const mailId = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(mailId)) {
      console.error('Invalid mail ID');
      return;
    }
    try {
      this.mail = await this.mailService.getById(mailId);
    } catch (error) {
      console.error('Error fetching mail:', error);
    }
  }

  openModal(): void {
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
  }

  async confirmCheck(): Promise<void> {
    if (this.mail) {
      try {
        await this.mailService.updateMailStatus(this.mail.id, { isChecked: true });
        await this.mailService.updateCheckObject(this.mail.id, this.user);
        console.log('Check confirmed!');
        this.closeModal();
        await this.router.navigate(['/mailview']);
      } catch (error) {
        console.error('Error confirming check:', error);
      }
    }
  }
}
