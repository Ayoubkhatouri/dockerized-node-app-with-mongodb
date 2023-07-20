let express = require('express');
let path = require('path');
let MongoClient=require('mongodb').MongoClient;
let fs = require('fs');
var app=express()

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
  });

app.get('/profile-picture', function (req, res) {
  let img = fs.readFileSync(path.join(__dirname, "images/profile-1.jpg"));
  res.writeHead(200, {'Content-Type': 'image/jpg' });
  res.end(img, 'binary');
});

app.get('/get-profile', function (req, res) {
 var response=res;
   MongoClient.connect('mongodb://admin:password@localhost:27017', function (err, client) {
      if (err) throw err;
      
    var db=client.db('user-account')
      
      var query = { userid: 1 };
      
      db.collection('users').findOne(query, function (err, result) {
        if(err) throw err;
        client.close();
        response.send(result)
      });
   });
});

app.post('/update-profile', function (req, res) {
  var userObj = req.body;
  var response =res;
  console. log('connecting to the db...');

MongoClient.connect('mongodb://admin:password@localhost:27017',function(err,client){
    if (err) throw err;

    var db = client.db('user-account');
    userObj['userid'] = 1
    var query = { userid: 1 };
    var newValues={$set:userObj}; 

    console. log('successfully connected to the user-account db');
    db.collection( 'users').updateOne(query, newValues, {upsert: true},function(err,res){
      if (err) throw err;
      console. log('successfully updated or inserted');
      client.close();
      response.send(userObj);
    });
  });
});



/*app.post('/update-profile', function (req, res) {
  let userObj = req.body;

  MongoClient.connect(mongoUrlLocal, mongoClientOptions, function (err, client) {
    if (err) throw err;

    let db = client.db(databaseName);
    userObj['userid'] = 1;

    let myquery = { userid: 1 };
    let newvalues = { $set: userObj };

    db.collection("users").updateOne(myquery, newvalues, {upsert: true}, function(err, res) {
      if (err) throw err;
      client.close();
    });

  });
  // Send response
  res.send(userObj);
});*/

/*app.get('/get-profile', function (req, res) {
  let response = {};
  // Connect to the db
  MongoClient.connect(mongoUrlLocal, mongoClientOptions, function (err, client) {
    if (err) throw err;

    let db = client.db(databaseName);

    let myquery = { userid: 1 };

    db.collection("users").findOne(myquery, function (err, result) {
      if (err) throw err;
      response = result;
      client.close();

      // Send response
      res.send(response ? response : {});
    });
  });
});*/

app.listen(3000, function () {
  console.log("app listening on port 3000!");
});
