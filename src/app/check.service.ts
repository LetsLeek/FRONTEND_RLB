import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, from } from 'rxjs';
import { Check } from './check';
import { ToastrService } from 'ngx-toastr';
import { AppComponent } from './app.component';

@Injectable({
  providedIn: 'root'
})
export class CheckService {
  private baseUrl = 'http://localhost:8080/api/checks';
  private checkNotification$ = new Subject<string>();
  

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  async getChecks(department: string): Promise<Check[]> {
    let url: string;

    switch(department.toUpperCase()) {
      case 'IT':
        url = `${this.baseUrl}?department=IT`;
        break;
      case 'PRODUKTION':
        url = `${this.baseUrl}?department=Produktion`;
        break;
      case 'NET':
        url = `${this.baseUrl}?department=NET`;
        break;
      case 'ALL':
        url = `${this.baseUrl}?department=all`;
        break;
      default:
        throw new Error('Invalid department');
    }

    try {
      const checks = await this.http.get<Check[]>(url).toPromise();
      return checks ?? []; 
    } catch (error) {
      console.error('Error fetching checks:', error);
      return [];
    }
  }

  async getCheckById(id: number, department: string): Promise<Check> {
    const url = `${this.baseUrl}/${id}?dep=${department}`;
    try {
      const check = await this.http.get<Check>(url).toPromise();
      if (check) {
        return check;
      } else {
        throw new Error(`No check found with ID ${id}`);
      }
    } catch (error) {
      console.error('Error fetching check by ID:', error);
      throw error;
    }
  }
  
  async getCheckByDate(date: string, department: string): Promise<Check> {
    const url = `${this.baseUrl}/date/${date}?dep=${department}`;
    try {
      const check = await this.http.get<Check>(url).toPromise();
      if (check) {
        return check;
      } else {
        throw new Error(`No check found for date ${date}`);
      }
    } catch (error) {
      console.error('Error fetching check by date:', error);
      throw error;
    }
  }
  

  async updateCheck(check: Check): Promise<void> {
    const url = `${this.baseUrl}?dep=${check.department}&id=${check.id}`;
    //const appComponent = inject(AppComponent);
    try {
      await this.http.put<{ message: string }>(url, check).toPromise();
      this.toastr.success('Check successfully updated');
      //await appComponent.checkForPendingChecks();
    } catch (error) {
      console.error('Error updating check:', error);
      this.toastr.error('Error updating Check');
    }
  }

  getCheckNotification(): Observable<string> {
    return this.checkNotification$.asObservable();
  }

  async checkPendingChecks(): Promise<void> {
    const departments = ['IT', 'PRODUKTION', 'NET'];
  
    for (const dep of departments) {
      const checks = await this.getChecks(dep);
      
      if (!checks) {
        console.error(`No checks found for department ${dep}`);
        continue;
      }
  
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(18, 0, 0, 0);
  
      if (now < endOfDay) continue; // Noch nicht 18 Uhr
  
      const pendingChecks = checks.filter(check => !check.isChecked);
  
      if (pendingChecks.length > 0) {
        const message = `Check(s) for ${pendingChecks.map(check => `${check.department} - ${check.date}`).join(', ')} are not completed!`;
        this.checkNotification$.next(message);
      }
    }
  }
}
