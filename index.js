const debug = require("debug")("Pecron::Index");
// Web server
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
// Modules
const fs = require("fs");

const _configPath = "./src/config/config.js";

if (!fs.existsSync(_configPath)) {
  console.error("[ERROR] Configuration file not found!");
  process.exit(-1);
}

const _Config = require(_configPath);

app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

app.use(
  cors({
    origin: _Config.webServer.origin,
    credentials: false,
    preflightContinue: true,
    exposedHeaders: ["Content-Type", "Set-Cookie"],
    allowedHeaders: [
      "Content-Type",
      "Set-Cookie",
      "Ara-App",
      "Ara-Version",
      "Authorization"
    ]
  })
);

app.listen(_Config.webServer.port, _Config.webServer.origin, async () => {
    console.log('Pecron-Api listening on -> %s:%i', _Config.webServer.origin, _Config.webServer.port)
})