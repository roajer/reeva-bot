import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptinComponent } from './optin.component';

describe('OptinComponent', () => {
  let component: OptinComponent;
  let fixture: ComponentFixture<OptinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
