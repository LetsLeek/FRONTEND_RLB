import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;
  private currentUser: { email: string, role: string, department: string } | null = null;

  private users = [
    { email: 'nelujuratoni@outlook.com', password: 'password', role: 'Admin', department: 'NET' },
    { email: 'mathiasgombos@outlook.com', password: 'password', role: 'Admin', department: 'IT' },
    { email: 'andreiureche@outlook.com', password: 'password', role: 'Worker', department: 'NET' },
    { email: 'loisgagea@outlook.com', password: 'password', role: 'Worker', department: 'Produktion' },
  ];

  login(email: string, password: string): boolean {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.isLoggedIn = true;
      this.currentUser = { email: user.email, role: user.role, department: user.department };
      return true;
    }
    return false;
  }

  logout() {
    this.isLoggedIn = false;
    this.currentUser = null;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  getCurrentUser(): { email: string, role: string, department: string } | null {
    return this.currentUser;
  }

  getRole(): string | null {
    return this.currentUser?.role || null;
  }

  getDepartment(): string | null {
    return this.currentUser?.department || null;
  }

  // Neuer Setter für den currentUser
  setCurrentUser(user: { email: string, role: string, department: string } | null) {
    this.currentUser = user;
    this.isLoggedIn = !!user; // Setzt isLoggedIn entsprechend des currentUser-Werts
  }
}
