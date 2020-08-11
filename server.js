// simple microservice. This was challenging for a non-node expert. JSON.stringify was the key, 
// also understanding that res.send is a hard stop.

'use strict';
const express = require('express');
const bodyParser = require('body-parser')

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.write('Successful request.\n');
  res.write('Another line.');
  res.end();
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
