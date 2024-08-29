import { Component, Input, OnInit, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { CheckProtocolTableComponent } from '../check-protocol-table/check-protocol-table.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [CheckProtocolTableComponent, CommonModule],
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  department: string | undefined;
  showTable: boolean = false;

  private route = inject(ActivatedRoute);

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const role = this.authService.getRole();
    const department = this.authService.getDepartment();

    if (role === 'Worker' && department) {
      // Wenn der Benutzer ein Worker ist, direkt die entsprechende Tabelle anzeigen
      this.department = department;
      this.showTable = true;
    } else {
      this.route.queryParams.subscribe(queryParams => {
        this.department = queryParams['dep'];
        if (this.department) this.selectDepartment(this.department);
        else this.showTable = false;
      });
    }
    
   
  }

  selectDepartment(department: string) {
    this.department = department;
    this.showTable = true;
  }
}
