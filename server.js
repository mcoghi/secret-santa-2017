// server.js

// init project
var express = require('express');
var app = express();

var storeHint = require("./storage").storeHint;
var displayHints = require("./storage").displayHints;
var storeEmail = require("./storage").storeEmail;
var displayParts = require("./storage").displayParts;
var randomHints = require("./storage").randomHints;

var sendEmail = require("./emails.js").sendEmail;

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// home page
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});


// display the list of hints
app.get("/hints", function (request, response) {
   
  displayHints(sendHints);
  
  function sendHints(documents){
    response.send(documents);
  }
  
});

// display the list of participants
app.get("/participants", function(request, response){

  displayParts(sendParts);
  
  function sendParts(documents){
    
    var documents = documents.map(function(value){
      return {
        mail : value.mail,
        name : value.name,
        partner : value.partner,
        child : value.child
      }
    })
    response.send(documents);
  }
  
});

// add a new hint
app.post("/hints", function (request, response) {
  
  // acces the database
  storeHint(request.query, sendHint);
    
  function sendHint(err, hint){

      response.send(err);

  }
});

// add a new email
app.post("/address", function (request, response){

  
  if (request.query.name == ''){
    // check that the name field is not empty
    sendMailStat('you forgot to write your name')
  } else if (validateEmail(request.query.mail)){
    // check that the emailaddress is valid
    // access the database
    console.log('sending request to database')
    storeEmail(request.query, sendMailStat);  
    
  } else {
    
    sendMailStat("!!enter a valid address!!");
  }
 
  //send response to client
  function sendMailStat(err){

    response.send(err);
    
  }
  
  //check if valid email address
  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  
});

//get a random sample from database
/*
app.get("/random", function(request, response){
  console.log('asking the database');
  var iterationLimit = null;
  displayParts(function(parts){
    
    //extract the secret Santa
    var alreadyExtracted = []
    var santas = parts.map(function(value, index){
      
      var rand = Math.floor(Math.random()*parts.length);
      var santa = parts[rand].name;
      var j = 0;
      while(santa == value.name || santa == value.partner || santa == value.child || alreadyExtracted.includes(rand) && j < 10000){
        
        rand = Math.floor(Math.random()*parts.length);
        santa = parts[rand].name;
        j++;
        
      }//while
      
      //check if the iteration went too far
      if (j == 10000) iterationLimit = j;
      
      j = 0;
 
      alreadyExtracted.push(rand);
      console.log(j);
      console.log(alreadyExtracted);
      return {santaEmail: parts[rand].mail, 
              santaName: parts[rand].name,
              recipient: value.name
              };
      
    });
    
    if (iterationLimit) response.send("iteration limit exceeded");
    
    displayHints(function(documents){
      
      //if there are too few hints, throw an error
      if (documents.length < 2*santas.length){
        response.send("too few hints, you need at least two per person");
      }
      
      //shuffle the hints and send two to each person
      shuffle(documents, function(documents){

        //extract the hints and send the emails  
        for (var i = 0; i < santas.length; i++){
          
          santas[i].hintOne = documents[2 * i].hint;
          santas[i].hintTwo = documents[2 * i + 1].hint;
          
          var mailTo = santas[i].santaEmail; //set the recipient
          
          var mailText = 'Ciao ' + santas[i].santaName + ",\n\n"
            + "quest'anno dovrai fare il regalo a \n\n"
            + santas[i].recipient + "\n\n"
            + "ma non dimenticare che deve essere attinente a questi temi:\n\n"
            + santas[i].hintOne + "\n"
            + santas[i].hintTwo + "\n\n"
            + "Buon lavoro!\n\n" + "Saluti,\n"
            + "Babbo natale";   
          
          sendEmail({
            from: "Secret Santa 2017", // sender address
            to: mailTo, // list of receivers
            subject: 'Secret Santa 2017', // Subject line
            text: mailText // plain text body 
          });
        }
              
        response.send(santas);
      });//shuffle
    });//display hints
  });

});
*/

//random shuffle array
function shuffle (array, callBack) {
  var i = 0
    , j = 0
    , temp = null

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  
  callBack(array)
}

// send email
app.get("/email", function(request, response){
  sendEmail();
  response.send("sent");
})



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
