import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRole = route.data['role'];
    const expectedDepartment = route.data['department'];

    const userRole = this.authService.getRole();
    const userDepartment = this.authService.getDepartment();

    // Check if the user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Check if the user's role and department match the expected values
    if (expectedRole && userRole !== expectedRole) {
      this.router.navigate(['/unauthorized']);  // Optional: Redirect to an "unauthorized" page
      return false;
    }

    if (expectedDepartment && userDepartment !== expectedDepartment) {
      this.router.navigate(['/unauthorized']);  // Optional: Redirect to an "unauthorized" page
      return false;
    }

    return true;
  }
}
