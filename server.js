
// simple microservice. JSON.stringify was the key, 
// also understanding that res.send is a hard stop.

'use strict';
const express = require('express');
const bodyParser = require('body-parser')
var Request = require("request");

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.write('<H1>This server registers a successful get.\n<H1>')
  res.write(req.ip);
  res.status(200).end();
  console.log('Server returned success on get.')
});

app.post('/', (req, res) => {
  var myData = req.body;
  console.log('Server got json:', myData);
  var now = new Date();
  myData.ip = req.ip;
  myData.date = now;
  console.log('Server updated json:', myData); 

  var myData2 = JSON.stringify(myData);
  res.write(myData2); //
  res.status(200).end();
  console.log('Server returned success on post.')
});


app.listen(PORT, HOST);

console.log(`Running on ${PORT}`);

// test a simple self-get

console.log('Request is testing a simple self-get')

Request.get("http://localhost:3000", (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    console.dir(body);
});

console.log('Request is testing a simple self-post')

Request.post({
    "headers": { "content-type": "application/json" },
    "url": "http://localhost:3000",
    "body": JSON.stringify({
        "firstname": "myFirstName",
        "lastname": "myLastName"
    })
}, (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    console.dir("Request received: \n"); 
    console.dir (JSON.parse(body));
});
