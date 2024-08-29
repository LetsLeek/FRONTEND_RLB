import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { NavComponent } from './nav/nav.component';
import { CheckProtocolTableComponent } from './check-protocol-table/check-protocol-table.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { ViewComponent } from './view/view.component';
import { LoginComponent } from './login/login.component';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';
import { CheckService } from './check.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    NavComponent,
    CheckProtocolTableComponent,
    SideNavComponent,
    ViewComponent,
    RouterModule,
    LoginComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'RLB Kärnten IT-Tool';
  alertMessage: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private checkService: CheckService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Listen to route changes and perform checks when the route changes
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.checkForPendingChecks();
      });

    // Perform an initial check when the app loads
    this.checkForPendingChecks();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  async checkForPendingChecks(): Promise<void> {
    // Skip checks if the user is not authenticated or is on the login page
    if (!this.isAuthenticated() || this.isLoginPage()) {
      this.clearPendingChecks();
      return;
    }

    const departments = ['IT', 'Produktion', 'NET'];
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(18, 0, 0, 0);

    for (const dep of departments) {
      try {
        const checks = await this.checkService.getChecks(dep);
        if (!checks) {
          console.error(`No checks found for department ${dep}`);
          continue;
        }

        const formattedToday = this.getFormattedToday();
        const formattedTomorrow = this.getFormattedTomorrow();

        const todayChecks = checks.filter(check => check.date === formattedToday);
        const pendingChecks = todayChecks.filter(check => !check.isChecked && check.department == this.authService.getDepartment());
        const unfinishedChecks = checks.filter(
          check => (check.date !== formattedToday && check.date !== formattedTomorrow) && !check.isChecked && check.department == this.authService.getDepartment()
        );

        if (unfinishedChecks.length > 0) {
          const message = `CRITICAL: Check(s) for ${unfinishedChecks.map(check => `${check.department} - ${check.date}`).join(', ')} are still unfinished!!!`;
          this.alertMessage = message;
          await this.showPendingChecksToast(message, dep, 'CRITICAL');
        }

        if (pendingChecks.length > 0 && now > endOfDay) {
          const message = `WARNING: Check(s) for ${pendingChecks.map(check => `${check.department} - ${check.date}`).join(', ')} are still not completed!`;
          this.alertMessage = message;
          this.showPendingChecksToast(message, dep, 'WARNING');
        }
      } catch (error) {
        console.error(`Error checking department ${dep}:`, error);
      }
    }
  }

  getFormattedToday(): string {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const formattedToday = `${day}.${month}.${year}`;
    return formattedToday;
  } 

  getFormattedTomorrow(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextDay = String(tomorrow.getDate()).padStart(2, '0');
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const year = tomorrow.getFullYear();
  
    const formattedTomorrow = `${nextDay}.${month}.${year}`;
    return formattedTomorrow;
  }
  

  async showPendingChecksToast(message: string, dep: string, type: string): Promise<void> {
    // If the user is not authenticated, don't show the toast
    if (!this.isAuthenticated()) {
      return;
    }
  
    const toastRef = this.toastr.error(message, 'Pending Checks', {
      tapToDismiss: true,
      disableTimeOut: true,
      onActivateTick: true  
    });
  
    toastRef.onHidden.subscribe(async () => {
      // Verwende eine asynchrone Funktion im subscribe-Callback
      try {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Warte 10 Sekunden
  
        if (this.alertMessage && this.isAuthenticated()) {
          const currChecks = await this.checkService.getChecks(dep);
          const formattedToday = this.getFormattedToday();
          const formattedTomorrow = this.getFormattedTomorrow();

          if (type == 'CRITICAL') { 
              const unfinishedChecks = currChecks.filter(
              check => (check.date !== formattedToday && check.date !== formattedTomorrow) && !check.isChecked && check.department == this.authService.getDepartment()
            );
            if (unfinishedChecks.length <= 0) return;
          }

          if (type == 'WARNING') { 
            const todayChecks = currChecks.filter(check => check.date === formattedToday);
            const pendingChecks = todayChecks.filter(check => !check.isChecked && check.department == this.authService.getDepartment());
          if (pendingChecks.length <= 0) return;
        }

          this.showPendingChecksToast(this.alertMessage, dep, type);
        }
      } catch (error) {
        console.error('Error in showPendingChecksToast:', error);
      }
    });
  }
  

  handleAlertClosed(): void {
    this.alertMessage = null;
    setTimeout(() => {
      if (this.isAfterTargetTime() && this.isAuthenticated()) {
        this.checkForPendingChecks();
      }
    }, 5000);
  }

  isAfterTargetTime(): boolean {
    const now = new Date();
    const targetTime = new Date();
    targetTime.setHours(18, 0, 0, 0);
    return now > targetTime;
  }

  private clearPendingChecks(): void {
    this.alertMessage = null;
    this.toastr.clear();
  }
}
