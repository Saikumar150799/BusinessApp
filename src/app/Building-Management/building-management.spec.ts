import { BuildingManagementComponent } from './building-management.component';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('BuildingManagementComponent', () => {
    let component: BuildingManagementComponent;
    let fixture: ComponentFixture<BuildingManagementComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BuildingManagementComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

})