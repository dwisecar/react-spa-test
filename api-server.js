const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const jwt = require("express-jwt");
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require("jwks-rsa");
const authConfig = require("./src/auth_config.json");

const app = express();

const port = process.env.API_PORT || 3001;
const appPort = process.env.SERVER_PORT || 3000;
const appOrigin = authConfig.appOrigin || `http://localhost:${appPort}`;

if (
  !authConfig.domain ||
  !authConfig.audience ||
  authConfig.audience === "YOUR_API_IDENTIFIER"
) {
  console.log(
    "Exiting: Please make sure that auth_config.json is in place and populated with valid domain and audience values"
  );

  process.exit();
}

app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ origin: appOrigin }));

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ["RS256"],
});

app.get("/api/external", function(req, res){
  let link = req.query.link
  res.send({
    msg: "Your access token was successfully validated!",
    link: link
  });
});

app.get("/api/coffee", checkJwt, jwtAuthz(['take:coffee']), (req, res) => {
  console.log(req.user)
  res.send({
    msg: "Time for a coffee break",
  });
});

app.get("/api/lunch", checkJwt, jwtAuthz(['take:lunch']), (req, res) => {
  res.send({
    msg: "Time for lunch",
  });
});



app.listen(port, () => console.log(`API Server listening on port ${port}`));
