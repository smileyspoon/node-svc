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
  res.write('Successful get.\n');
  res.status(200).end();
});

app.post('/', (req, res) => {
  var myData ='received:' + JSON.stringify(req.body);
  console.log('Got body:', myData);
  res.write(myData); //
  res.status(200).end();
  console.log('returned success.')
});


app.listen(PORT, HOST);

console.log(`Running on ${PORT}`);

// test a simple self-get

console.log('testing a simple self-get')

Request.get("http://localhost:3000", (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    console.dir(body);
});

console.log('testing a simple self-post')

Request.post({
    "headers": { "content-type": "application/json" },
    "url": "http://httpbin.org/post",
    "body": JSON.stringify({
        "firstname": "Nic",
        "lastname": "Raboy"
    })
}, (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    console.dir(JSON.parse(body));
});
