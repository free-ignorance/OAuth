import * as express from "express";
import helmet from "helmet"; // Security updates 

import { logger, config } from "./utils";

import { DefaultController } from "./controllers";
import { cors } from "./middleware";
import { HealthCheckController } from "./controllers/health";
import { SlackController } from "./controllers/slack";

const PORT = config.port;

class App {
    public app: express.Application;

    constructor(controllers: DefaultController[]) {
        logger.info(`Initializing Server...`);
        this.app = express.default();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    public listen() {
        this.app.listen(PORT, () => {
            logger.info(`[\x1b[32mSUCCESS\x1b[0m] Server Initialized and Listening on the PORT ${PORT}`);
        });
    }

    public getServer() {
        return this.app;
    }

    private initializeMiddlewares() {
        logger.info(`Initializing Middlewares...`);
        this.app.use(helmet()); // adds xss and other security out of box
        this.app.use(express.json());
        this.app.use(cors.corsMiddleware);
    }

    private initializeControllers(controllers: DefaultController[]) {
        controllers.forEach((controller) => {
            logger.info(`Initializing Controller for "${controller.path}" ...`);
            this.app.use("/", controller.router);
            controller.initializeRoutes();
        });
    }
}

const app = new App([
    new HealthCheckController(),
    new SlackController(),
]);

app.listen();
