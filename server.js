
// simple microservice. JSON.stringify was the key, 
// also understanding that res.send is a hard stop.

'use strict';
const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser')
const Request = require("request");

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
       //res.write("can i respond here"); // write after end error
       //this.res.write("i'll be amazed."); //Cannot read property 'write' of undefined. this.write also didn't work
       console.dir("01 body returned.")
       //console.dir(response);
       var body01 = body;
       console.log("moved to body01:\n " + body01 + "\n\n");
       
        // it outputs to the console but can't incorporate it into the response via res.write. 
        // scoping almost certainly. 
     });
     //res.write(body); // no
     //res.write(JSON.stringify(body)); // no

     // console.log("2nd time: \n" + body01+ "\n\n"); // no fell out of scope
     // call 02
     console.dir("Console: calling node-svc-02")
     Request.get("http://node-svc-02:3000/2", (error, response, body) => {
     if(error) {
        return console.dir(error);
     }
       console.dir("02 body returned.")
       console.dir(body);
    });
    res.write("anything?\n"); //I *can* still write response here. So problem is variable. 
  //res.write(body); //no
  //res.write(JSON.stringify(body)); //no
   
  //console.log("3nd time: \n" + body01+ "\n\n"); // no fell out of scope
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
  console.log("Console: /2 Server completed get.\n")
});

app.listen(PORT, HOST);

console.log(`Running on ${PORT}`);

// test a simple self-get

console.log('Console: request is testing a simple self-get')

//fetch('http://localhost:3000')
//  .then(response => response.json())
//  .then(data => console.log(data));


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
