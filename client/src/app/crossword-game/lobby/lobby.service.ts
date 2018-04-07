import { Injectable } from '@angular/core';

import { GameConfiguration } from "../../../../../common/crosswordsInterfaces/gameConfiguration";
// import { Difficulty } from "../../../../../common/constants";


@Injectable()
export class LobbyService {

    public onlineGames: GameConfiguration[] = [];

    //TODO: REMOVE
    public SHOW_MOCK_DATA: boolean = false; // ou true
    public MOCK_DATA: GameConfiguration[] = []; // [new GameConfiguration("1", "Jacques Demers", Difficulty.EASY),
    //                                          new GameConfiguration("6", "Jacques Demers", Difficulty.EASY),
    //                                          new GameConfiguration("2", "Jacques Demers", Difficulty.HARD),
    //                                          new GameConfiguration("3", "Jacques Demers", Difficulty.NORMAL),
    //                                          new GameConfiguration("4", "Jacques Demers", Difficulty.EASY),
    //                                          new GameConfiguration("5", "Jacques Demers", Difficulty.NORMAL)];


    public constructor() {
        this.onlineGames = this.SHOW_MOCK_DATA ? this.MOCK_DATA : this.onlineGames;
    }

}