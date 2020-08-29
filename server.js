

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
  console.log('Console: / Server returned success on get.')
});

app.get('/1', (req, res) => {
   let recd = fetch('http://node-svc-01:3000')
         .then(response => response.json())
         .then(resjson => {console.log("/1 subrequest rec'd" + JSON.stringify(resjson)); })
  res.write(dateIPStamp(recd, req.ip));
  res.status(200).end();
  console.log('Console: /1 Server returned success on get.')
});

app.post('/', (req, res) => {
  console.log ("Console: entered / post");
  console.log("Console: / received " + JSON.stringify(req.body));
  let recd = req.body;
  recd.action = "POST";
  let stampedRecd = dateIPStamp(recd, req.ip);
  res.write(stampedRecd); //
  res.status(200).end();
  console.log('Console: / returned ' + stampedRecd);
});

app.post('/1', (req, res) => {
  console.log ("Console: entered /1 post");
  let recd = req.body;
  console.log('Console: /1 received southbound POST with ' + JSON.stringify(recd));
  recd.action = "POST";
  const url ='http://node-svc-01:3000';
  console.log("Console: /1 attempting POST with " + JSON.stringify(recd));
  // try passing res into the fetch function
  let recd2 =   (async () => {
        const body = recd;
	const response = await fetch(url, {
		method: 'post',
		body: JSON.stringify(body),
		headers: {'Content-Type': 'application/json'}
	});
	const json = await response.json();
        recd2 = await dateIPStamp(json, req.ip);
	console.log("Console: /1 received northbound " +recd2);
        return recd2;
  })();
   console.log("Console: exited fetch with " + recd2);
  res.write("placeholder");
  //res.write(recd2);
  res.status(200).end();
  console.log('Console: /1 ending post.')
  }
);

app.get('/2', (req, res) => {
   let recd = fetch('http://node-svc-01:3000/1')
         .then(response => response.json())
         .then(resjson => {console.log("/2 subrequest rec'd" + JSON.stringify(resjson)); })
  res.write(dateIPStamp(recd, req.ip));
  res.status(200).end();
  console.log('Console: /2 Server returned success on get.')
});


app.listen(PORT, HOST);

console.log(`Running on ${PORT}`);

// test a simple self-get

console.log('Console: request is testing a simple self-get')

fetch('http://localhost:3000')
  .then(response => response.json())
  .then(data => console.log(data));

// test a simple self-post
console.log('Console: request is testing a simple self-post')

const url ='http://localhost:3000';
const headers = {
  "Content-Type": "application/json"
};
const postData = JSON.stringify({
  "firstName": "myFirstName",
  "lastName": "myLastName"
});

fetch(url, { method: 'POST', headers: headers, body: postData})
  .then((res) => {
     return res.json()
})
.then((json) => {
   // Do something with the returned data.
  console.log(json);
});

function dateIPStamp(recdJSON, someIP) {
  console.log ("DateIPStamp reached with " + JSON.stringify(recdJSON) + " " + someIP);
  recdJSON.ip = someIP;
  let now = new Date();
  recdJSON.date = now;
  let returnJSON = JSON.stringify(recdJSON);
  //console.log('testFunc reached' + returnJSON);
  return(returnJSON);
  
};
