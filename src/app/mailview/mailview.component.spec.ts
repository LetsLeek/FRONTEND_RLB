import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailViewComponent } from './mailview.component';

describe('MailViewComponent', () => {
  let component: MailViewComponent;
  let fixture: ComponentFixture<MailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MailViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
