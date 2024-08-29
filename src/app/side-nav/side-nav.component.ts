import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterLink, RouterOutlet, CommonModule],
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent {
  private openDropdown: string | null = null;
  userInfo = { 
    "isAdmin": this.authService.getRole() === "Admin" ? true : false, 
    "department": this.authService.getDepartment()
  }; 

  constructor(private router: Router, private authService: AuthService) {
    // Öffne das Dropdown automatisch, wenn der aktuelle Pfad aktiv ist
    if (this.router.url.startsWith('/overview') && this.userInfo.isAdmin) {
      this.openDropdown = 'overview';
    } else if (this.router.url.startsWith('/keywords')) {
      this.openDropdown = 'keywords';
    } 
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  isSubMenuActive(menu: string[]): boolean {
    return menu.some(word => this.router.url.includes(word));
  }

  toggleDropdown(menu: string): void {
      // Wenn das aktuelle Dropdown bereits offen ist, schließen
    if (this.openDropdown === menu) {
      this.openDropdown = null;
    } else {
      // Ansonsten das aktuelle Dropdown öffnen und alle anderen schließen
      this.openDropdown = menu;
    }
    
  }

  isDropdownOpen(menu: string): boolean {
    return this.openDropdown === menu;
  }
}


