import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailViewDetailComponent } from './mailview-detail.component';

describe('MailviewDetailComponent', () => {
  let component: MailViewDetailComponent;
  let fixture: ComponentFixture<MailViewDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MailViewDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MailViewDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
