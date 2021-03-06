import { AfterViewInit, Component} from "@angular/core";
import { TracksProxyService } from "../tracks/tracks-proxy.service";
import { ITrackData } from "../../../../../common/ItrackData";

@Component({
    selector: "app-admin",
    templateUrl: "./admin.component.html",
    styleUrls: ["./admin.component.css"]
})

export class AdminComponent implements  AfterViewInit {
    public tracks: ITrackData[];

    public constructor( private proxy: TracksProxyService ) {
        this.tracks = [];
    }

    public async ngAfterViewInit(): Promise<void> {
        try {
            await this.proxy.initialize();
            this.tracks = this.proxy.tracks;
        } catch (error) {
            console.error(error);
        }
    }

    public async deleteTrack(trackName: string): Promise<void>  {
        try {
            await this.proxy.deleteTrack(trackName);
            this.tracks = this.proxy.tracks;
        } catch (error) {
            console.error(error);
        }
    }
}
