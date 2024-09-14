//console.log( __filename );
//console.log( __dirname );
//npm install express --save
//npm install body-parser --save
//npm install cookie-parser --save
//npm install multer --save

const express = require("express");
const app = express();
const crypto = require("node:crypto");

const axios = require("axios");

const otelColProtocal = process.env.OTEL_COL_PROTOCOL || "http";
const otelColUrl = process.env.OTEL_COL_URL || "otelcol";
const otelColPort = process.env.OTEL_COL_PORT || 4318;

const appPort = process.env.APP_PORT || 8081;

function areConnectionsEstablishedAndMaintained() {
  return axios
    .get(`${otelColProtocal}://${otelColUrl}:${otelColPort}`)
    .then(() => true)
    .catch(() => false);
}

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.get("/liveness", function (req, res) {
  console.log("liveness")
  res.send("OK");
});

app.get("/readiness", function (req, res) {
  // Check if connections are established and maintained
  console.log(areConnectionsEstablishedAndMaintained())
  if (areConnectionsEstablishedAndMaintained()) {
    res.sendStatus(200);
  } else {
    res.sendStatus(503);
  }
});

app.get("/randomstr", function (req, res) {
  const randomstr = crypto.randomBytes(20).toString("hex");
  res.send(randomstr);
});

const server = app.listen(appPort, function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});

process.on("SIGTERM", () => {
  debug("SIGTERM signal received: closing HTTP server gacefully");
  server.close(() => {
    debug("HTTP server shutdown gracefully");
  });
});
