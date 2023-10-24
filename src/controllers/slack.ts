import * as express from "express";
import { WebClient } from "@slack/web-api";
import { InstallProvider } from '@slack/oauth';

import { DefaultController } from "./";
import { logger, fancyText, config } from "../utils";

class SlackController extends DefaultController {
  constructor() {
    super("/slack");
  }

  public initializeRoutes() {
    const get = `[${fancyText("GET","green")}]`;
    this.router.get(`${this.path}/ping`, this.getSlackCheck);
    logger.info(`     - ${get} ${this.path}/ping`);
    this.router.get(`${this.path}/token`, this.getAuthToken);
    logger.info(`     - ${get} ${this.path}/token`);
    this.router.get(`${this.path}/token/success`, this.getSlack);
    logger.info(`     - ${get} ${this.path}/token/success`);
  }

  private getSlackCheck = (
    request: express.Request,
    response: express.Response
  ) => {
    // check if slack credentials are provisioned and working
    if(!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
      response.status(500).send("Slack credentials not provisioned");
    } else {
      response.status(200).send("pong");
    }
  };

  private getAuthToken = (
    request: express.Request,
    response: express.Response
  ) => {
    // initialize the installProvider
    const installer = new InstallProvider({
      clientId: `${config.slack_client_id}`,
      clientSecret: `${config.slack_client_secret}`,
      stateSecret: `${config.slack_state_secret}`,
    });

    installer.handleCallback(request, response);

  };
  
  private getAuthTokenOld = (
    request: express.Request,
    response: express.Response
  ) => {
    if (!request.query || !request.query.code) {
      response.status(400).send(`Missing attributes 'code'`);
    }
    const slack = new WebClient(`${config.slack_token}`);
    slack.oauth
      .access({
        client_id: `${config.slack_client_id}`,
        client_secret: `${config.slack_client_secret}`,
        code: `${request.query.code}`,
        redirect_uri: `${config.slack_redirect_uri}`
      })
      .then(json => {
        response.status(200).json(json);
      })
      .catch(error => {
        console.log(error);
        response.status(500).send(error);
      });
  };

  private getSlack = (
    request: express.Request,
    response: express.Response
  ) => {
    const slackResponse = this.getDefaultResponse();

    slackResponse.data = {
      message: "success"
    };
    response.status(200).send(slackResponse);
  };
}

export { SlackController };
