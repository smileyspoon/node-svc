

// simple microservice. JSON.stringify was the key, 
// also understanding that res.send is a hard stop.

'use strict';
const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser')
//const Request = require("request");

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.write(dateIPStamp({ "action":"GET" }, req.ip));
  res.status(200).end();
  console.log('Console: Server returned success on get.')
});

app.post('/', (req, res) => {
  let recd = req.body;
  recd.action = "POST";
  res.write(dateIPStamp(recd), req.ip); //
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
   fetch('http://localhost:3000')
    .then(response => response.json())
    .then(data => {
   console.log("/1 subrequest rec'd" + JSON.stringify(data))
  })

  res.write(data);
  res.status(200).end();
  console.log('Console: /1 Server returned success on get.')
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
  res.status(200).end();
  console.log("Console: /2 Server completed get.\n")
});

app.listen(PORT, HOST);

console.log(`Running on ${PORT}`);

// test a simple self-get

console.log('Console: request is testing a simple self-get')

fetch('http://localhost:3001')
  .then(response => response.json())
  .then(data => console.log(data));

// test a simple self-post
console.log('Console: request is testing a simple self-post')

const url ='http://localhost:3001';
const headers = {
  "Content-Type": "application/json"
};
const data = JSON.stringify({
  "firstName": "myFirstName",
  "lastName": "myLastName"
});

fetch(url, { method: 'POST', headers: headers, body: data})
  .then((res) => {
     return res.json()
})
.then((json) => {
   // Do something with the returned data.
  console.log(json);

});




function dateIPStamp(recdJSON, someIP) {
  recdJSON.ip = someIP;
  let now = new Date();
  recdJSON.date = now;
  let returnJSON = JSON.stringify(recdJSON);
  //console.log('testFunc reached' + returnJSON);
  return(returnJSON);
  
};
