import * as express from "express";
import * as path from "path";
import * as logger from "morgan";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import Types from "./types";
import { injectable, inject } from "inversify";
import { Routes } from "./routes";
import { LexicalService } from "./lexicalService/lexicalService";

import { GridGeneratorService } from "./gridGeneratorService";
// import { JsonReader } from "./lexicalService/jsonReader";
// import { WordValidator } from "./wordValidator";

@injectable()
export class Application {

    private readonly internalError: number = 500;
    public app: express.Application;

    constructor(@inject(Types.Routes) private api: Routes,
                @inject(Types.LexicalService) private lexicalService: LexicalService,
                @inject(Types.GridGeneratorService) private gridGeneratorService: GridGeneratorService) {
        this.app = express();

        this.config();

        this.initializeRoutes();
/**teste la lecture */
        //const reader: JsonReader = new JsonReader();
        // const wordValidator: WordValidator = new WordValidator();
        // trouve un nom commun avec une definition alternative
        //console.log(reader.getValidWordsBasedOnRarity(require("./lexicalService/words.json"), true) );

    }

    private config(): void {
        // Middlewares configuration
        this.app.use(logger("dev"));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, "../client")));
        this.app.use(cors());
    }

    public initializeRoutes(): void {
        const router: express.Router = express.Router();

        router.use(this.api.routes);
        router.use(this.lexicalService.routes);
        router.use(this.gridGeneratorService.routes);
        
        this.app.use(router);

        this.errorHandeling();
    }

    private errorHandeling(): void {
        // Gestion des erreurs
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const err: Error = new Error("Not Found");
            next(err);
        });

        // development error handler
        // will print stacktrace
        if (this.app.get("env") === "development") {
            // tslint:disable-next-line:no-any
            this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
                res.status(err.status || this.internalError);
                res.send({
                    message: err.message,
                    error: err
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user (in production env only)
        // tslint:disable-next-line:no-any
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(err.status || this.internalError);
            res.send({
                message: err.message,
                error: {}
            });
        });
    }
}
