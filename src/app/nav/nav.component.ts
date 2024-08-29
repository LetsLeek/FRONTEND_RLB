import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  isModalVisible: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  closeModal(): void {
    this.isModalVisible = false;
  }

  confirmSignout(): void {
    this.closeModal();
    this.authService.logout()
    this.router.navigate(['/login']);
  }

  openModal(): void {
    this.isModalVisible = true;
  }
}
