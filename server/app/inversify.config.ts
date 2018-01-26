import { Container } from "inversify";
import Types from "./types";
import { Server } from "./server";
import { Application } from "./app";
import { Index } from "./routes/index";
import { Routes } from "./routes";
import { ServiceLexical } from "./serviceLexical";

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);
container.bind(Types.Routes).to(Routes);
container.bind(Types.ServiceLexical).to(ServiceLexical);

container.bind(Types.Index).to(Index);

export { container };
