import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckDetailComponent } from './check-detail.component';

describe('CheckDetailComponent', () => {
  let component: CheckDetailComponent;
  let fixture: ComponentFixture<CheckDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
