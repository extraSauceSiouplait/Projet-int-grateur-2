import { TestBed, inject } from "@angular/core/testing";
import { RaceResultsService } from "./race-results.service";
import { PLAYERS_NAME } from "../../constants";

describe("RaceResultsService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RaceResultsService]
        });
    });

    it("should be created", inject([RaceResultsService], (service: RaceResultsService) => {
        expect(service).toBeTruthy();
    }));

    it("doneLap should find right player", inject([RaceResultsService], (service: RaceResultsService) => {
        service.initialize();
        // tslint:disable:no-magic-numbers
        service.doneLap(PLAYERS_NAME[0], 90);

        expect(service.getPlayerRaceResults(PLAYERS_NAME[0]).laps[0]).toEqual(90);
    }));
});
