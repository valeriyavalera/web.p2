const express = require("express");
const bodyParser = require("body-parser");
const Mongo = require("./setup/mongoose");

require('dotenv').config();

const { usersApiRouter } = require("./api/usersAPI");
const { linksApiRouter } = require("./api/linksAPI");


const app = express();
app.use(bodyParser.json());


app.use(bodyParser.json());

const setup = async () => {
  await Mongo.setupDb(process.env.MONGO_DB_URI);

  app.use(usersApiRouter);
  app.use(linksApiRouter);

  app.listen(process.env.PORT, () => {
    console.log("server started ${process.env.PORT}");
  });
};
  
setup();