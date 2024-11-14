import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConsumoApiPage } from './consumo-api.page';

describe('ConsumoApiPage', () => {
  let component: ConsumoApiPage;
  let fixture: ComponentFixture<ConsumoApiPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumoApiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
