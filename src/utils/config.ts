
/**
 * Express-generator boilerplate improved
 * @description This function is a safety railguard to make sure the port provided is number, if not a number then a string and if anything else set it to false.
 */
function normalizePort(val: any) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

const config = {
  port: normalizePort(process.env.PORT || "3000"),
  slack_client_id: process.env.SLACK_CLIENT_ID,
  slack_client_secret: process.env.SLACK_CLIENT_SECRET,
  slack_redirect_uri: process.env.SLACK_REDIRECT_URI
};

export { config, normalizePort };

