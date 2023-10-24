import * as express from "express";

import { DefaultController } from "./";
import { health } from "../models";
import { logger, fancyText } from "../utils";


class HealthCheckController extends DefaultController {
  constructor() {
    super("/health");
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getHealthCheck);
    const get = `[${fancyText("GET","green")}]`;
    logger.info(`     - ${get} ${this.path}`);
  }

  private getHealthCheck = (
    request: express.Request,
    response: express.Response
  ) => {
    const checkResponse = this.getDefaultResponse();
    const healthCheck = health.getHealthCheck();
    checkResponse.data = {
      ...healthCheck,
    };
    response.status(200).send(checkResponse);
  };
}

export { HealthCheckController };
