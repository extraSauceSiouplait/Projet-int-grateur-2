import { TestBed, inject } from "@angular/core/testing";

import { GameStateService } from "./game-state.service";
import { Difficulty } from "../../../../common/constants";

const hostName: string = "host";
const guestName: string = "guest";
const hostScore: number = 10;
const guestScore: number = 2;
const isMultiplayer: boolean = true;
const difficulty: Difficulty = Difficulty.EASY;

describe("GameStateService", () => {

    let gameState: GameStateService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GameStateService]
        });

        gameState = new GameStateService();
    });

    it("should be created", inject([GameStateService], (service: GameStateService) => {
        expect(service).toBeTruthy();
    }));

    it("should be initialized correctly on construction", () => {
        expect(gameState.hostName).toBe("");
        expect(gameState.guestName).toBe("");
        expect(gameState.hostScore).toBe(0);
        expect(gameState.guestScore).toBe(0);

        expect(gameState.difficulty).toBe(null);
    });

    it("should be in an invalid state on construction", () => {
        expect(gameState.isValidState()).toBe(false);
    });

    it("should be in a valid state after setting attributes if the game isn't started", () => {
        gameState.hostName = "0";
        gameState.difficulty = Difficulty.EASY;
        expect(gameState.isValidState()).toBe(true);
    });

    it("should be in a invalid state after starting a game", () => {
        gameState.hostName = "0";
        gameState.difficulty = Difficulty.EASY;
        gameState.startGame();
        expect(gameState.isValidState()).toBe(false);
    });

    it("should set attributes", () => {
        gameState.setGameInfo(hostName, guestName, difficulty, isMultiplayer);

        expect(gameState.hostName).toBe(hostName);
        expect(gameState.guestName).toBe(guestName);
        expect(gameState.difficulty).toBe(difficulty);
    });

    it("should be update scores correctly", () => {
        gameState.updateScores(hostScore, guestScore);

        expect(gameState.hostScore).toBe(hostScore);
        expect(gameState.guestScore).toBe(guestScore);
    });

    it("should start a game", () => {
        gameState.startGame();
        expect(gameState.isOngoing).toBe(true);
    });

    it("should wait for an opponent", () => {
        gameState.waitForOpponent();
        expect(gameState.isWaitingForOpponent).toBe(true);
    });

    it("should reset scores", () => {
        gameState.resetScores();
        expect(gameState.hostScore).toBe(0);
        expect(gameState.guestScore).toBe(0);
    });

});
