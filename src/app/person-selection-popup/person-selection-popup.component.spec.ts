import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonSelectionPopupComponent } from './person-selection-popup.component';

describe('PersonSelectionPopupComponent', () => {
  let component: PersonSelectionPopupComponent;
  let fixture: ComponentFixture<PersonSelectionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonSelectionPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonSelectionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
