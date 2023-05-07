const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const Mongo  = require('./setup/mongoose');

const { Users } = require('./models/users');

const app = express();

app.use(bodyParser.json());

const setup = async () => {

    await Mongo.setupDb(process.env.MONGO_DB_URI);

    app.listen(process.env.PORT, () => {
      console.log("server started");
    });
  };
  
  setup();