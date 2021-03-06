import { injectable} from "inversify";
import { Router, Request, Response } from "express";
import { MongoDBAccess } from "./mongoDBAccess";
import { ITrackData } from "../../common/ItrackData";

@injectable()
export class MongoDBService {

    public get routes(): Router {
        const router: Router = Router();

        router.get( "/service/mongoDB",
                    async (req: Request, res: Response) => {
                        const tracksData: ITrackData[] = await MongoDBAccess.getAll();

                        res.send(tracksData);
                    });

        router.post("/service/mongoDB",
                    async (req: Request, res: Response) => {
                        const trackData: ITrackData = await MongoDBAccess.addTrack(req.body as ITrackData);

                        res.send(trackData);
                    });

        router.delete(  "/service/mongoDB/:name",
                        async (req: Request, res: Response) => {
                            await MongoDBAccess.remove(req.params.name);
                            res.send();
                        });

        router.put( "/service/mongoDB",
                    async (req: Request, res: Response) => {
                        await MongoDBAccess.updateExistingTrack(req.body as ITrackData);
                        res.send();
                    });

        router.patch(   "/service/mongoDB/:name",
                        async (req: Request, res: Response) => {
                            await MongoDBAccess.incrementTimesPlayed(req.params.name);
                            res.send();
                        });

        return router;

    }
}
