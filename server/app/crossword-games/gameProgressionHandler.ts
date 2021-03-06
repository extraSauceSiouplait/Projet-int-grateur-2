import { CrosswordGame } from "../../../common/crosswordsInterfaces/crosswordGame";
import { GridWord } from "../../../common/crosswordsInterfaces/word";

export class GameProgessionHandler {

    public static isAddValidatedWord(word: GridWord, game: CrosswordGame, socketId: string): boolean {
        const isNewValidatedWord: boolean = !this.includesWord(game, word);
        if (isNewValidatedWord) {
            this.addValidatedWord(socketId, game, word);
        }

        return isNewValidatedWord;
    }

    private static includesWord(game: CrosswordGame, wordToFind: GridWord): boolean {
        for (const word of game.hostValidatedWords) {
            if (word.value === wordToFind.value) {
                return true;
            }
        }
        for (const word of game.guestValidatedWords) {
            if (word.value === wordToFind.value) {
                return true;
            }
        }

        return false;
    }

    private static addValidatedWord(socketId: string, game: CrosswordGame, word: GridWord): void {
        if (socketId === game.hostId) {
            game.hostValidatedWords.push(word);
        } else {
            game.guestValidatedWords.push(word);
        }
    }

}
