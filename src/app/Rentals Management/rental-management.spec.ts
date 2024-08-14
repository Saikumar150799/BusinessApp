import { RentalsComponent } from './rental-management.component';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('RentalsComponent', () => {
    let component: RentalsComponent;
    let fixture: ComponentFixture<RentalsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RentalsComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

})