import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOcurrenceComponent } from './create-ocurrence.component';

describe('CreateOcurrenceComponent', () => {
  let component: CreateOcurrenceComponent;
  let fixture: ComponentFixture<CreateOcurrenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateOcurrenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOcurrenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
