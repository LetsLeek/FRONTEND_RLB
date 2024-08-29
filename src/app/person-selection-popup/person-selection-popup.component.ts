import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Person } from '../person';
import { KeywordService } from '../keyword.service';

@Component({
  selector: 'app-person-selection-popup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './person-selection-popup.component.html',
  styleUrls: ['./person-selection-popup.component.css']
})
export class PersonSelectionPopupComponent implements OnInit {
  @Input() selectedPersons: Person[] = [];
  @Input() department: string = ''; // Add department input
  @Output() close = new EventEmitter<Person[] | null>();

  persons: Person[] = [];
  filteredPersons: Person[] = [];
  searchTerm = new FormControl('');
  initialSelection: Person[] = [];

  keywordService: KeywordService = inject(KeywordService);

  constructor() {}

  async ngOnInit() {
    this.loadPersons(this.department);

    this.searchTerm.valueChanges.subscribe(term => this.filterPersons(term));
  }

  async loadPersons(department: string) {
    
    try {
      // Verwende `await` mit der Methode `getAllPersons`
      const persons = await this.keywordService.getAllPersons(department);
      this.persons = persons;
      this.filteredPersons = persons;
      this.initialSelection = [...this.selectedPersons];
    } catch (err) {
      console.error('Error fetching persons:', err);
    }
  }
  

  filterPersons(term: string | null) {
    if (term === null) {
      this.filteredPersons = this.persons;
    } else {
      this.filteredPersons = this.persons.filter(person =>
        person.name.toLowerCase().includes(term.toLowerCase()) || person.email.toLowerCase().includes(term.toLowerCase())
      );
    }
  }

  isSelected(person: Person): boolean {
    return this.selectedPersons.some(s => s.email === person.email);
  }

  togglePersonSelection(person: Person) {
    if (this.isSelected(person)) {
      this.selectedPersons = this.selectedPersons.filter(s => s.email !== person.email);
    } else {
      this.selectedPersons.push(person);
    }
  }

  closePopup() {
    this.selectedPersons = [...this.initialSelection]; // Revert to initial selection on cancel
    this.close.emit(null);
  }

  saveSelection() {
    this.initialSelection = [...this.selectedPersons]; // Update initial selection on save
    this.close.emit(this.selectedPersons);
  }
}
