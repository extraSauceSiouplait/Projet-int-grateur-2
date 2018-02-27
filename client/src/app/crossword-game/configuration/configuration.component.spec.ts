import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import {APP_BASE_HREF} from "@angular/common";

import { ConfigurationComponent } from "./configuration.component";
import { routes } from "../../app-routes.module";
import { AppModule } from "../../app.module";


describe("ConfigurationComponent", () => {
    let component: ConfigurationComponent;
    let fixture: ComponentFixture<ConfigurationComponent>;

    beforeEach(async(() => {
        // tslint:disable-next-line:no-floating-promises
        TestBed.configureTestingModule({
        imports: [routes, AppModule],
        providers: [{provide: APP_BASE_HREF, useValue : "/" }]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfigurationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should update routerLink to easy game", () => {
       component.updateLink("easy");
       expect(component.link).toBe("easy/ui");
    });

    it("should update routerLink to normal game", () => {
        component.updateLink("normal");
        expect(component.link).toBe("normal/ui");
     });

    it("should update routerLink to hard game", () => {
        component.updateLink("hard");
        expect(component.link).toBe("hard/ui");
    });

});
