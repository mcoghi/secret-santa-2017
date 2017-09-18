"use strict"

var mongo = require("mongodb");

var password = require("./credentials.js").mongoPassword;
var user = require("./credentials.js").mongoUser;
var dbUrl = "mongodb://" + user + ":" + password + "@ds127864.mlab.com:27864/fccprojects";


function storeHint(query, callBack){
  // connect to the database, check if the field is already there, if not store it
  // return the new input or an error message if it was already in the collection
  mongo.connect(dbUrl, function(err, db){
    
    if (err) throw err;
    
    var hints = db.collection("secretSanta"); //open the collection
    
    //search for the entry
    hints.find(query).toArray(function(err, documents){
      
      if (err) throw err;
      
      //if the entry is new, store it
      if (documents.length == 0){
        
        hints.insert(query, function(err, data){
          
          if (err) throw err;

          callBack(null, query);
        })
        
      } else {
        // if the the entry is not new, advise the client        
        callBack("!!your word is already there!!", null);
      }
    })
    
  })  
}//storeHints

function displayHints(callBack){
  //retrive the list of hints
  
  mongo.connect(dbUrl, function (err, db){
    
    if (err) throw err;
    
    var hints = db.collection('secretSanta');
    hints.find({}).toArray(function(err, documents){
      
      if (err) throw err;
      
      callBack(documents);
    })
  })
}//displayHints

function displayParts(callBack){
  //retrive the list of participants

  mongo.connect(dbUrl, function(err, db){
    
    if (err) throw err;
    
    var parts = db.collection('addressesDatabase');
    
    parts.find({}).toArray(function(err, documents){
      
      if (err) throw err;
      
      callBack(documents);
      
    })
  })
}

function storeEmail(query, callBack){
  console.log('got request from server')
  console.log(query);
  // store a new email address in the database
  mongo.connect(dbUrl, function(err, db){
    var addresses = db.collection("addressesDatabase");
    
    //search for the email
    addresses.find({mail: query.mail}).toArray(function(err, documents){
      
      if (err) throw err;
      
      if (documents.length == 0){
        
        addresses.insert(query, function(err, data){
          
          if (err) throw err;
          console.log("comunicating results from db to server")
          callBack(null);
          
        })
      } else {
        
        callBack("!!email already in use!!");
      }
    })
  })
}//storeEmail



module.exports = {
  storeHint : storeHint,
  displayHints : displayHints,
  storeEmail : storeEmail,
  displayParts : displayParts
}