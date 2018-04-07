import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { GameConfiguration } from "../../../../common/crosswordsInterfaces/gameConfiguration";
import { LobbyService } from "./lobby/lobby.service";
import { Difficulty } from "../../../../common/constants";
// import { GridService } from "./grid.service";
import { WordService } from "./word.service";
// import { ValidatorService } from "./validator.service";

import { GridWord } from "../../../../common/crosswordsInterfaces/word";
import { Router } from "@angular/router";

@Injectable()
export class SocketService {

    public socket: SocketIOClient.Socket;
    public game: GameConfiguration;
    public isHost: boolean;

    public constructor( private lobbyService: LobbyService, public wordService: WordService,
                        private router: Router) {
        this.game = null;
        this.socket = io.connect("http://localhost:3000");

        this.socket.on("gameLobbies", (gameLobbies: GameConfiguration[]) => {
            this.lobbyService.onlineGames = gameLobbies;
        });

        this.socket.on("gridFromJoin", (game: GameConfiguration) => {
            this.initializeGridFromJoin(game);
        });

        this.socket.on("updateValidatedWord", (game: GameConfiguration) => {
            this.game = this.castGame(game);
            console.log("Validated host and guest: ");
            console.log(this.game.hostValidatedWords);
            console.log(this.game.guestValidatedwords);
        });

        this.socket.on("initializeGame", (game: GameConfiguration) => {
            this.game = this.castGame(game);
            this.router.navigate(["crossword-game/" + this.game.difficulty + "/ui"]);
            console.log("Validated host and guest: ");
            console.log(this.game.hostValidatedWords);
            console.log(this.game.guestValidatedwords);
        });

    }


    public castGame(game: GameConfiguration): GameConfiguration {
        const words: GridWord[] = this.castHttpToGridWord(game._words);
        const hostValidatedWords: GridWord[] = this.castHttpToGridWord(game.hostValidatedWords);
        const guestValidatedwords: GridWord[] = this.castHttpToGridWord(game.guestValidatedwords);
        const castedGame: GameConfiguration = new GameConfiguration(game.roomId, game.hostUsername, game.difficulty, words);

        castedGame.guestValidatedwords = guestValidatedwords;
        castedGame.hostValidatedWords = hostValidatedWords;

        return castedGame;
    }

    private castHttpToGridWord(httpWords: GridWord[]): GridWord[] {
        const words: GridWord[] = [];
        for (const word of httpWords) {
            words.push(new GridWord(word.row, word.column, word.direction, word.value, word.definition));
        }

        return words;
    }

    public async createGame(username: string, difficulty: Difficulty): Promise<void> {
        // console.log("try to create");
        await this.createGrid(difficulty);
        this.socket.emit("createGame", username, difficulty, this.wordService.words);
        this.isHost = true;
    }

    public joinGame(roomId: string): void {
        this.socket.emit("joinGame", roomId);
        this.isHost = false;
    }

    public getGameLobbies(): void {
        this.socket.emit("getGameLobbies");
    }

    public addValidatedWord(): void {
        this.socket.emit("addedValidatedWord", this.game);
    }

    private async createGrid(difficulty: Difficulty): Promise<void> {
        await this.wordService.initialize(difficulty);
    }

    private initializeGridFromJoin(game: GameConfiguration): void {
        this.game = this.castGame(game);
        game._words.forEach((word) => {
            this.wordService.words.push(new GridWord(word.row, word.column, word.direction, word.value, word.definition));
        });
        this.router.navigate(["crossword-game/" + game.difficulty + "/ui"]);

    }
}