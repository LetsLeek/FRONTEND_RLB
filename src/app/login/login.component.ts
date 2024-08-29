import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {this.authService.setCurrentUser(null); }

  onSubmit() {
    const isAuthenticated = this.authService.login(this.email, this.password);
    if (isAuthenticated) {
      this.router.navigate(['/']);
    } else {
      alert('Login failed');
    }
  }
}
