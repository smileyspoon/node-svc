

// simple microservice. 

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
  (async () => {
  const myWrite = await res.write(dateIPStamp({ "action":"GET" }, req.ip));
  const myEnd = await res.status(200).end();
  await console.log('Console: / Server returned success on get.');
  })();
});

// app.get('/:depth(\d+)', (req, res) => {   // WHY does this not work
app.get('/:depth', (req, res) => {
  console.log("/1 GET, making GET subrequest");
  console.log ("got "+ JSON.stringify(req.params));
  console.log ("isNumeric " + isNumeric(req.params.depth));
  if (!isNumeric(req.params.depth)) { 
    console.log("non-numeric path attempted");
    res.write("error, only numeric depth path supported");
    res.status(405).end();
    return;
  }
  let numNodes = 2; // to be derived from arrNodes
  let intDepth = parseInt(req.params.depth);
         let nodeNum = numNodes;

  for (let intLevel = intDepth; intLevel >=0; intLevel =  intLevel - numNodes) {
   console.log(intLevel);
    for (let intNodeCall = intLevel; 
         intNodeCall > (intLevel - numNodes) & intNodeCall > 0; 
         intNodeCall--) {
         console.log(" call node" + nodeNum); // making the call here
         if (nodeNum >1) {nodeNum--} else {nodeNum = numNodes}; 
    }
   // round robin? list of n servers as  initialization
  // assume array of servers has been imported as javascript object 
  
  // 
  }
    console.log ("intLevel is now 0, call node " + nodeNum);
  //

  (async () => {
	const response = await fetch('http://node-svc-02:3000');
	const json = await response.json();
	console.log(json);
        res.write(dateIPStamp(json, req.ip));  
        res.status(200).end();
        console.log('Console: /1 Server returned success on get.');
  })();
});

app.get('/2', (req, res) => {
  console.log("/2 GET, making GET subrequest");
  (async () => {
        const response = await fetch('http://node-svc-02:3000/1');
        const json = await response.json();
        console.log(json);
        res.write(dateIPStamp(json, req.ip));  
        res.status(200).end();
        console.log('Console: /2 Server returned success on get.');
  })();
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
  console.log ("Console: /1 POST");
  (async () => {
        console.log("/1 POST trying subrequest");
        const recd = await req.body;
        const headers = {"Content-Type": "application/json"};
        const postData = await JSON.stringify({recd});
        const response = await fetch('http://node-svc-01:3000', { method: 'POST', headers: headers, body: postData});
        const json = await response.json();
        console.log(json);
        res.write(dateIPStamp(json, req.ip));  
        res.status(200).end();
        console.log('Console: /1 Server returned success on get.');
  })();
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
  console.log(json);
});


function dateIPStamp(recdJSON, someIP) {
  console.log ("DateIPStamp reached with " + JSON.stringify(recdJSON) + " " + someIP);
  let now = new Date();
  if (!recdJSON.hasOwnProperty("arrTimeStamp")) {
  recdJSON.arrTimeStamp = [ someIP + " " + now ];
  } else {
  recdJSON["arrTimeStamp"].push(someIP + " " + now)
  };
  let strReturnJSON = JSON.stringify(recdJSON);
  return(strReturnJSON);
  
}

function isNumeric(strIn) {
  // returns  bool
  let re = /\d+/;
  return (re.test(strIn));
}
