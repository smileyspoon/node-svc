
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
  res.write('Response: successful get from ');
  res.write(req.ip);
  res.write("\n");
  res.status(200).end();
  console.log('Console: Server returned success on get.')
});

app.post('/', (req, res) => {
  var myData = req.body;
  console.log('Console: server got json:', myData);
  var now = new Date();
  myData.ip = req.ip;
  myData.date = now;
  console.log('Console: server updated json:', myData); 
  var myData2 = JSON.stringify(myData);
  res.write(myData2); //
  res.status(200).end();
  console.log('Console: server returned success on post.')
});

// this is where I need to think hard. 
// this code could be running on any node
// if someone posts to /1, what to do? 
// call node-svc-01? that could be a loop. 
// I really don't want any conditionals
// how about: if you post to /1, it calls all the 2s 
// that's an OK start
app.get('/1', (req, res) => {
  res.write("Response: successful get on api /1. ")
  res.write(req.ip);
  res.write("\n");
  //make 2 external calls
   // call 01
   console.dir("Console: calling node-svc-01");
   Request.get("http://node-svc-01:3000/2", (error, response, body) => {
     if(error) {
        return console.dir(error);
     }
     //res.write("01 responded");
     console.dir(body);
     });
     //res.write(JSON.stringify(body));

     // call 02
     console.dir("Console: calling node-svc-02")
     Request.get("http://node-svc-02:3000/2", (error, response, body) => {
     if(error) {
        return console.dir(error);
     }
      console.dir(body);
    });

  
  res.status(200).end();
  console.log("Console: /1 Server completed get.\n")
});


app.post('/1', (req, res) => {
  var myData = req.body;
  console.log('Console: server got json:', myData);
  var now = new Date();
  myData.ip = req.ip;
  myData.date = now;
  console.log('Console: server updated json:', myData); 

  var myData2 = JSON.stringify(myData);
  res.write(myData2); //
  res.status(200).end();
  console.log('Console: server returned success on post.')
});

app.get('/2', (req, res) => {
  res.write('Response: /2 successful get from ');
  res.write(req.ip);
  //res.write("\n");
  res.status(200).end();
  console.log("Console: /2 Server returned success on get.\n")
});

app.listen(PORT, HOST);

console.log(`Running on ${PORT}`);

// test a simple self-get

console.log('Console: request is testing a simple self-get')

Request.get("http://localhost:3000", (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    console.dir(body);
});

console.log('Console: request is testing a simple self-post')

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
    console.dir("Console: request received: \n"); 
    console.dir (JSON.parse(body));
});
