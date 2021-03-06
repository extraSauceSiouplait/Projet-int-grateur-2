import * as http from "http";
import * as SocketIo from "socket.io";

import { CrosswordGame } from "../../common/crosswordsInterfaces/crosswordGame";
import { Difficulty, SocketMessage, PlayerType } from "../../common/constants";
import { GridWord } from "../../common/crosswordsInterfaces/word";

import { GameProgessionHandler } from "./crossword-games/gameProgressionHandler";
import { GameLobbiesHandler } from "./crossword-games/gameLobbiesHandler";
import { castHttpToGridWords } from "../../common/communication/httpToObjectCasting";

export class Io {

    private socketServer: SocketIO.Server;

    constructor(server: http.Server) {

        this.socketServer = SocketIo(server);
        this.socketServer.on(SocketMessage.CONNECTION, (socket: SocketIO.Socket) => {
            this.initializeServerGameManager(socket);
            this.initializeServerGameProgression(socket);
            this.initializeServerGameRestarter(socket);
        });
    }

    private initializeServerGameManager(socket: SocketIO.Socket): void {
        socket.on(SocketMessage.CREATE_GAME, (username: string, difficulty: Difficulty, words: GridWord[]) => {
            const roomId: string = this.createAndJoinNewRoom(socket);
            GameLobbiesHandler.createGame(roomId, socket.id, username, difficulty, words, false);
            this.broadcastGameLists();
        });

        socket.on(SocketMessage.CREATE_SOLO_GAME, (username: string, difficulty: Difficulty, words: GridWord[]) => {
            const roomId: string = this.createAndJoinNewRoom(socket);
            socket.emit(SocketMessage.INITIALIZE_GAME, GameLobbiesHandler.createGame(roomId, socket.id, username, difficulty, words, true));
        });

        socket.on(SocketMessage.JOIN_GAME, (roomId: string, guestName: string) => {
            if (!GameLobbiesHandler.isAlreadyInAGame(socket.id)) {
                socket.join(roomId);
                const joinedGame: CrosswordGame = GameLobbiesHandler.joinGame(roomId, socket.id, guestName);
                socket.emit(SocketMessage.SENT_GAME_AFTER_JOIN, joinedGame);
                socket.to(joinedGame.hostId).emit(SocketMessage.INITIALIZE_GAME, joinedGame);
                this.broadcastGameLists();
            }
        });

        socket.on(SocketMessage.GET_GAME_LOBBIES, () => {
            this.broadcastGameLists();
        });

        socket.on(SocketMessage.DISCONNECT, () => {
            this.socketDisconnected(socket);
        });
    }

    private initializeServerGameRestarter(socket: SocketIO.Socket): void {

        socket.on(SocketMessage.HOST_RESTART_PENDING, (roomId: string, isGuestReady: boolean, newWords: GridWord[]) => {
            this.hostAskForRestart(roomId, isGuestReady, newWords);
        });
        socket.on(SocketMessage.GUEST_RESTART_PENDING, (roomId: string, isHostReady: boolean) => {
            this.guestAskForRestart(roomId);
        });
    }

    private initializeServerGameProgression(socket: SocketIO.Socket): void {

        socket.on(SocketMessage.ADD_VALIDATED_WORD, (word: GridWord, roomId: string) => {
            try {
                const game: CrosswordGame = GameLobbiesHandler.getGame(roomId);
                if (GameProgessionHandler.isAddValidatedWord(word, game, socket.id)) {
                    this.socketServer.in(game.roomId).emit(SocketMessage.UPDATE_VALIDATED_WORD, game);
                }
            } catch (error) {
                console.error(error);
            }
        });

        socket.on(SocketMessage.SELECT_WORD, (selectedWord: GridWord) => {
            try {
                socket.to(GameLobbiesHandler.getGame(socket.id).roomId).emit(SocketMessage.REMOTE_SELECTED_WORD, selectedWord);
            } catch (error) {
                console.error(error);
            }
        });

        socket.on(SocketMessage.DESELECT_WORD, (word: GridWord) => {
            try {
                socket.to(GameLobbiesHandler.getGame(socket.id).roomId).emit(SocketMessage.REMOTE_DESELECTED_WORD, word);
            } catch (error) {
                console.error(error);
            }
        });
    }

    private broadcastGameLists(): void {
        this.socketServer.emit(SocketMessage.GAME_LOBBIES, GameLobbiesHandler.pendingGames, GameLobbiesHandler.multiplayerGames);
    }

    private createAndJoinNewRoom(socket: SocketIO.Socket): string {
        const roomId: string = "game" + (GameLobbiesHandler.numberOfGames).toString();
        socket.join(roomId);

        return roomId;
    }

    private hostAskForRestart(roomId: string, isGuestReady: boolean, newWords: GridWord[]): void {
        try {
            const game: CrosswordGame = GameLobbiesHandler.getGame(roomId);
            game.restartGame();
            game._words = castHttpToGridWords(newWords);
            game.isWaitingForRestart[PlayerType.HOST] = true;

            this.socketServer.in(roomId).emit(SocketMessage.HOST_ASKED_FOR_RESTART, game);

            if (isGuestReady) {
                game.isWaitingForRestart[PlayerType.HOST] = false;
                game.isWaitingForRestart[PlayerType.GUEST] = false;
                this.socketServer.in(roomId).emit(SocketMessage.SENT_GAME_AFTER_JOIN, game);
            }
        } catch (error) {
            console.error(error);
        }
    }

    private guestAskForRestart(roomId: string): void {
        try {
            const game: CrosswordGame = GameLobbiesHandler.getGame(roomId);
            game.isWaitingForRestart[PlayerType.GUEST] = true;
            this.socketServer.in(roomId).emit(SocketMessage.GUEST_ASKED_FOR_RESTART, game);
        } catch (error) {
            console.error(error);
        }
    }

    private socketDisconnected(socket: SocketIO.Socket): void {
        try {
            const game: CrosswordGame = GameLobbiesHandler.getGame(socket.id);

            if (game.isAPlayerWaitingForRestart()) {
                this.socketServer.in(game.roomId).emit(SocketMessage.OPPONENT_DISCONNECTED_WHILE_WAITING);
            } else {
                this.socketServer.in(game.roomId).emit(SocketMessage.OPPONENT_DISCONNECTED);
            }
            GameLobbiesHandler.disconnect(socket.id);

            this.broadcastGameLists();
        } catch (error) {
            console.error(error);
        }
    }
}
