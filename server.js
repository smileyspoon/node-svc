

// simple microservice. 

'use strict';
const arrNodes = [ "node-svc-01" ]
//const arrNodes = [ "node-svc-01", "node-svc-02" ]
//const arrNodes = [ "node-svc-01", "node-svc-02" , "node-svc-03" ]
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

app.get('/0?', (req, res) => {     // matches either / or /0
  (async () => {
  const myWrite = await res.write(dateIPStamp({ "action":"GET" }, req.ip));
  const myEnd = await res.status(200).end();
  await console.log('Console: / Server returned success on get.');
  })();
});

// app.get('/:depth(\d+)', (req, res) => {   // WHY does this not work
app.get('/:depth', (req, res) => {   // everything else but / or /0
  console.log("/1 GET, making GET subrequest");
  console.log ("got "+ JSON.stringify(req.params));
  console.log ("isNumeric " + isNumeric(req.params.depth));
  if (!isNumeric(req.params.depth)) { 
    console.log("non-numeric path attempted");
    res.write("error, only numeric depth path supported");
    res.status(405).end();
    return;
  }
  // what is the formula for which node to call? 
  // given x levels and n nodes
  // x % n  where x>n, else n
  let intCurrLevel = parseInt(req.params.depth);
  let numNodes = arrNodes.length; // to be derived from arrNodes
  let nextLevel = intCurrLevel - 1;
  console.log ("nextLevel " + nextLevel + " numNodes " + numNodes);  
  let nextNode = nextLevel >= numNodes ? nextLevel % numNodes : nextLevel;
  let strURL = buildURL(arrNodes[nextNode], nextLevel);
  console.log ("calling node " + strURL);

  (async () => {
	const response = await fetch(strURL);
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
 
function buildURL (strHostIn, intLevel) {
   console.log  ("entered buildURL with strHostIn: " + strHostIn + " intLevel " + intLevel);
   return("http://" + strHostIn + ":3000/" + intLevel);
}
