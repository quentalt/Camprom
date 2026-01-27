import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraCard } from './camera-card';

describe('CameraCard', () => {
  let component: CameraCard;
  let fixture: ComponentFixture<CameraCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CameraCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CameraCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
