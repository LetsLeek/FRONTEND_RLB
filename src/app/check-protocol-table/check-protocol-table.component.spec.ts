import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckProtocolTableComponent } from './check-protocol-table.component';

describe('CheckProtocolTableComponent', () => {
  let component: CheckProtocolTableComponent;
  let fixture: ComponentFixture<CheckProtocolTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckProtocolTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckProtocolTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
