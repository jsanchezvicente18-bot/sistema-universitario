import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Aperturas } from './aperturas';

describe('Aperturas', () => {
  let component: Aperturas;
  let fixture: ComponentFixture<Aperturas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Aperturas],
    }).compileComponents();

    fixture = TestBed.createComponent(Aperturas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
