import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Keyword } from '../keyword';
import { KeywordService } from '../keyword.service';
import { PersonSelectionPopupComponent } from '../person-selection-popup/person-selection-popup.component';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Person } from '../person';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { Popover } from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-keyword',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule, PersonSelectionPopupComponent, PopoverModule],
  templateUrl: './keyword.component.html',
  styleUrls: ['./keyword.component.css'],
  animations: [
    trigger('expandCollapse', [
      state('expanded', style({
        height: '*',
        opacity: 1,
        transform: 'scaleY(1)'
      })),
      state('collapsed', style({
        height: '0px',
        opacity: 0,
        transform: 'scaleY(0)'
      })),
      transition('expanded <=> collapsed', [
        animate('0.3s ease-in-out')
      ])
    ])
  ]
})
export class KeywordComponent implements OnInit, AfterViewInit {
  sortDirection: 'asc' | 'desc' = 'asc';
  sortColumn: string = 'name';
  keywordList: Keyword[] = [];
  removedKeyword: Keyword | null = null;
  isModalVisible: boolean = false;
  filteredKeywords: Keyword[] = [];
  expandedKeywords: Set<string> = new Set<string>();
  keywordService = inject(KeywordService);
  toastService = inject(ToastrService);
  authService = inject(AuthService);
  

  selectedFilter: string | null = null;
  editingKeyword: Keyword | null = null;
  isPopupVisible: boolean = false;
  selectedPersons: Person[] = [];
  isOffcanvasVisible: boolean = false;
  isFilterOptionsVisible: boolean = false;

  searchTerm: string = '';
  filterByControlWeekly_Firstworkday: boolean = false;
  filterByControlDaily: boolean = false;

  keywordForm = new FormGroup({
    name: new FormControl(''),
    control: new FormControl(''),
    department: new FormControl(''),
    responsiblePersons: new FormControl<Person[]>([])
  });

  selectedDepartment: string = 'Alle';
  isAdmin: boolean = false;

  constructor() {}

  async ngOnInit() {
    this.isAdmin = this.authService.getRole() === 'Admin';
    if (!this.isAdmin) {
      this.selectedDepartment = this.authService.getDepartment() ?? "";
      this.filterByDepartment(this.selectedDepartment);
    }
    await this.loadKeywords();
    this.sortKeywords('name'); // Default sort on load
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializePopovers();
    }, 0);
  }         

onSearchChange() {
  const term = this.searchTerm.trim().toLowerCase();

  if (term) {
      if (this.selectedFilter == "weekly_firstworkday" || this.selectedFilter == "daily") {
        this.filteredKeywords = this.filteredKeywords.filter(keyword =>
          keyword.name.toLowerCase().includes(term) && keyword.control == this.selectedFilter
        );
      } else {
        this.filteredKeywords = this.filteredKeywords.filter(keyword =>
          keyword.name.toLowerCase().includes(term)
        );
      }
    
  } else {
    this.loadKeywords();
  }
}


  toggleFilterOptions(): void {
    this.isFilterOptionsVisible = !this.isFilterOptionsVisible;
  }

  sortKeywords(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'desc';
    }

    this.filteredKeywords.sort((a: any, b: any) => {
      const valueA = a[column].toLowerCase();
      const valueB = b[column].toLowerCase();

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      } else if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }


  

  initializePopovers() {
    try {
      const popoverTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="popover"]'));
      popoverTriggerList.forEach(popoverTriggerEl => {
        new Popover(popoverTriggerEl); // Initialisiere Popover aus bootstrap
      });
    } catch (error) {
      console.error('Error initializing popovers:', error);
    }
  }

  async loadKeywords(): Promise<void> {
    try {
      this.keywordList = await this.keywordService.getAllKeywords();
      
      // Initialisiere die gefilterte Liste mit allen Keywords
      this.filteredKeywords = this.keywordList;
  
      if (this.isAdmin) {
        this.filteredKeywords = this.keywordList; 
      } else {
        this.filteredKeywords = this.keywordList.filter(keyword => keyword.department === this.selectedDepartment);  // Worker sieht nur Keywords des eigenen Departments
      }
    } catch (err) {
      console.error('Error loading keywords:', err);
    }
  }
  
  

  async startEditing(keyword: Keyword) {
    this.editingKeyword = keyword;
    this.selectedPersons = [...keyword.responsiblePersons];
    this.keywordForm.patchValue({
      name: keyword.name,
      control: keyword.control,
      department: keyword.department,
      responsiblePersons: keyword.responsiblePersons
    });

    this.openOffcanvas();
  }

  stopEditing() {
    this.editingKeyword = null;
    this.keywordForm.reset();
    this.selectedPersons = [];
    this.closeOffcanvas();
  }

  openModal(keyword: Keyword): void {
    this.removedKeyword = keyword;
    this.isModalVisible = true;
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.removedKeyword = null;
  }

  async confirmDelete(): Promise<void> {
    try {
      if (this.removedKeyword != null) {
        await this.keywordService.deleteKeyword(this.removedKeyword);
        await this.loadKeywords();
        this.closeModal();
      } 
    } catch(err) {
      console.error('Error deleting keyword:', err);
    }
  }

  async updateKeyword() {
    if (this.editingKeyword) {
      const formValue = this.keywordForm.value;
      const updatedKeyword: Keyword = {
        ...this.editingKeyword,
        name: formValue.name ?? '', // Standardwert für null
        control: formValue.control ?? '', // Standardwert für null
        department: formValue.department ?? '', // Standardwert für null
        responsiblePersons: this.selectedPersons,
        id: this.editingKeyword.id, // ID bleibt wie sie ist
        checkedBy: this.editingKeyword.checkedBy // Behalte checkedBy bei, falls es relevant ist
      };
  
      try {
        await this.keywordService.updateKeyword(updatedKeyword);
        this.stopEditing();
        await this.loadKeywords(); // Refresh the keyword list
      } catch (err) {
        console.error('Error updating keyword:', err);
      }
    }
  }
  

  showPopup() {
    this.isPopupVisible = true;
    this.selectedPersons = [...(this.keywordForm.value.responsiblePersons || [])];
  }

  handlePopupClose(selectedPersons: Person[] | null) {
    this.isPopupVisible = false;
    if (selectedPersons) {
      this.selectedPersons = selectedPersons;
    } else {
      this.selectedPersons = []; 
    }
  }

  removePerson(event: Event, person: Person) {
    event.stopPropagation();
    this.selectedPersons = this.selectedPersons.filter(p => p !== person);
    this.keywordForm.patchValue({ responsiblePersons: this.selectedPersons });
  }

  openOffcanvas() {
    this.isOffcanvasVisible = true;
  }

  closeOffcanvas() {
    this.isOffcanvasVisible = false;
  }

  filterByDepartment(department: string) {
    this.selectedDepartment = department;
    this.filteredKeywords = this.keywordList.filter(keyword => keyword.department === department);
  }

  clearFilter() {
    this.selectedDepartment = 'Alle';
    this.filteredKeywords = this.keywordList;
  }

  clearControlFilter() {
    this.selectedFilter = null;
  }

  getDepartment(): string {
    return this.keywordForm.get('department')?.value || '';
  }
}
