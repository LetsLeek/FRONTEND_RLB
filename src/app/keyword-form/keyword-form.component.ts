import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Person } from '../person';
import { KeywordService } from '../keyword.service';
import { PersonSelectionPopupComponent } from '../person-selection-popup/person-selection-popup.component';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'; // Importiere den AuthService

@Component({
  selector: 'app-keyword-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PersonSelectionPopupComponent],
  templateUrl: './keyword-form.component.html',
  styleUrls: ['./keyword-form.component.css'],
})
export class KeywordFormComponent implements OnInit {
  personList: Person[] = [];
  selectedPersons: Person[] = [];
  initialSelectedPersons: Person[] = [];
  isPopupVisible: boolean = false;
  isAdmin: boolean = false; // Variable für Admin-Status

  keywordService: KeywordService = inject(KeywordService);
  toastr: ToastrService = inject(ToastrService);
  authService: AuthService = inject(AuthService); // AuthService injizieren

  keywordForm = new FormGroup({
    name: new FormControl(''),
    control: new FormControl('daily'), // Default to 'daily' 
    department: new FormControl('IT'),  // Default to 'IT' (only for admin)
  });

  constructor(private router: Router) {}

  async ngOnInit() {
    // Überprüfe, ob der Benutzer ein Admin ist
    this.isAdmin = this.authService.getRole() === 'Admin';
  
    if (!this.isAdmin) {
      // Hole das Department des Benutzers und setze es in das Formular
      const userDepartment = this.authService.getDepartment() ?? "";
      this.keywordForm.patchValue({ department: userDepartment });
      this.keywordForm.get('department')?.disable(); // Deaktiviere das Department-Feld für Worker
    }

    // await this.loadPersons(this.keywordForm.value.department ?? "");
  
    this.keywordForm.get('department')?.valueChanges.subscribe(async (department) => {
      if (this.isAdmin) {
        await this.loadPersons(department ?? 'IT');
      }
      this.selectedPersons = [];
    });
  }
  

  async onSubmit() {
    const formName = this.keywordForm.value.name || '';
    const formControl = this.keywordForm.value.control || '';
    const formDepartment = this.keywordForm.value.department || '';

    try {
      await this.keywordService.submitApplication(formName, formDepartment, this.selectedPersons, formControl);
      await this.router.navigate(['/keywords']);
    } catch (error) {
      this.toastr.error('This is an error message!');
    }
  }

  showPopup() {
    this.isPopupVisible = true;
    this.initialSelectedPersons = [...this.selectedPersons];  // Track initial selection
  }

  handlePopupClose(selectedPersons: Person[] | null) {
    this.isPopupVisible = false;
    if (selectedPersons) {
      this.selectedPersons = selectedPersons;
    } else {
      this.selectedPersons = this.initialSelectedPersons;  // Revert to initial selection on cancel
    }
  }

  removePerson(event: MouseEvent, person: Person) {
    event.stopPropagation();
    this.selectedPersons = this.selectedPersons.filter(
      (p) => p.email !== person.email
    );
  }

  async loadPersons(department: string) {   
    try {
      this.personList = await this.keywordService.getAllPersons(department);
      console.log(`Success fetching persons from ${department}`);
    } catch (err) {
      console.error(`Error fetching persons from ${department}:`, err);
    }
  }

  getDepartment(): string {
    return this.keywordForm.get('department')?.value || 'IT';
  }
}
