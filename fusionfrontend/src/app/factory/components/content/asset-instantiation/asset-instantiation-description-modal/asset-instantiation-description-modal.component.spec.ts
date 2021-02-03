import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetInstantiationDescriptionModalComponent } from './asset-instantiation-description-modal.component';

describe('AssetInstantiationDescriptionModalComponent', () => {
  let component: AssetInstantiationDescriptionModalComponent;
  let fixture: ComponentFixture<AssetInstantiationDescriptionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetInstantiationDescriptionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetInstantiationDescriptionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
