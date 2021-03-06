import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { APP_BASE_HREF } from "@angular/common";

import { InformationsComponent } from "./informations.component";
import { routes } from "../../app-routes.module";
import { AppModule } from "../../app.module";

describe("InformationsComponent", () => {
    let component: InformationsComponent;
    let fixture: ComponentFixture<InformationsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [routes, AppModule],
            providers: [{provide: APP_BASE_HREF, useValue : "/" }]
        })
        .compileComponents().catch( (error: Error) => console.error(error));
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InformationsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
