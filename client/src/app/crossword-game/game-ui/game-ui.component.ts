import { Component, OnInit } from "@angular/core";
import { WordService } from "../word.service";
import { GridService } from "../grid.service";
import { ValidatorService } from "../validator.service";
import { UserGridService } from "../user-grid.service";
import { SelectionService } from "../selection/selection.service";
import { Router } from "@angular/router";
import { GameStateService } from "../game-state.service";
import { DefinitionsService } from "../definitions/definitions.service";

@Component({
    selector: "app-game-ui",
    templateUrl: "./game-ui.component.html",
    styleUrls: ["./game-ui.component.css"],
    providers: [ValidatorService, GridService, UserGridService]
})

export class GameUiComponent implements OnInit {
    public constructor( private selectionService: SelectionService,
                        public wordService: WordService,
                        public validator: ValidatorService,
                        public gridService: GridService,
                        public gameState: GameStateService,
                        public router: Router,
                        private definitionsService: DefinitionsService) {}

    public async ngOnInit(): Promise<void> {
        this.initialize();
    }

    public deselect(): void {
        this.selectionService.deselect();
    }

    public returnToMenu(): void {
        this.router.navigate(["/"]);
        window.location.reload();
    }

    private initialize(): void {
        this.gridService.initialize();
        this.validator.initialize();
        this.definitionsService.initialize();
    }
}
