'use strict';

/* Import the required modules */
const express = require('express');
const {Datastore} = require('@google-cloud/datastore');
var cors = require('cors');

/* Get the express, datastore apps */
const app = express();
const dataStore = new Datastore();

var corsOptions = {
  origin: 'https://dineshwedsindu.appspot.com',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

function postGreeting(req, res) {
  res.status(200);
  // TBD
}

function getGreetigns(req, res) {
  function buildPostsList() {
    return function(row) {
      return {'CreatedTime': row.CreatedTime, 'Name': row.Name, 'Post': row.Log };
    }
  }

  function convTsToDateTime(value) {
    var str = "";
    var date = new Date(parseInt(value));
    str = date.toLocaleString('en-GB');
    return str;
  }

  async function _getGreetings(req, res) {
    const query = dataStore.createQuery("GuestBook");
    query.filter("TestMode", 0);
    const [rows] = await dataStore.runQuery(query, {wrapNumbers: {integerTypeCastFunction: convTsToDateTime}});
    const posts = rows.map(buildPostsList());
    res.status(200);
    res.json(posts);
  }

  _getGreetings(req, res);
}

/* For the favicon */
app.get('/favicon.ico', (req, res) => {
  res.sendFile(__dirname + '/favicon.ico');
});

/* For posting a greeting */
app.post('/greet', (req, res) => {
  postGreeting(req, res);
});

/* For getting the greetings */
app.get('/list', (req, res) => {
  getGreetigns(req, res);
});
/* For getting the greetings */
app.get('/root', (req, res) => {
  getGreetigns(req, res);
});

/* For others route to home page */
app.get('/*', (req, res) => {
  res.sendFile(__dirname + '/index.htm');
});

/* Get the port and set listening */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

/* Export our app */
module.exports = app;