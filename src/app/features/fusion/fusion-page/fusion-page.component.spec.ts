import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FusionPageComponent } from './fusion-page.component';

describe('FusionPageComponent', () => {
  let component: FusionPageComponent;
  let fixture: ComponentFixture<FusionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FusionPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FusionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
