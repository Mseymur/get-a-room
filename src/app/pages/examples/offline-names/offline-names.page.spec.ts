import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfflineNamesPage } from './offline-names.page';

describe('OfflineNamesPage', () => {
  let component: OfflineNamesPage;
  let fixture: ComponentFixture<OfflineNamesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OfflineNamesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
