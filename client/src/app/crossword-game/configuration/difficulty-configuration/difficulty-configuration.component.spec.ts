import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import {APP_BASE_HREF} from "@angular/common";

import { DifficultyConfigurationComponent } from "./difficulty-configuration.component";
import { routes } from "../../../app-routes.module";
import { AppModule } from "../../../app.module";

describe("ConfigurationComponent", () => {
    let component: DifficultyConfigurationComponent;
    let fixture: ComponentFixture<DifficultyConfigurationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
        imports: [routes, AppModule],
        providers: [{provide: APP_BASE_HREF, useValue : "/" }]
        })
        .compileComponents().catch( (error: Error) => console.error(error));
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DifficultyConfigurationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
