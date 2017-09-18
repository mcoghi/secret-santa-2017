// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(function() {
  
  // ask the server for the list of hints
  $.get('/hints', function(hints) {

    hints.forEach(function(hint) {

      $('<li></li>').text(hint.hint).appendTo('ul#hints');
      
    });
  });
  
  // ask the server for the list of participants
  $.get('/participants', function(participants){

    participants.forEach(function(part){
       
      var displayNew = part.name;
        
      if(part.partner != ""){displayNew += (" (" + part.partner);
          if(part.child != ""){displayNew += (", " + part.child);}
          displayNew += ")";
                               }
       $('<li></li>').text(displayNew).appendTo('ul#participants');
       
     })   
  })

  // ask the server to submit a new hint
  $('.new-hint').submit(function(event) {
    event.preventDefault();
    var hint = $('.hint-input').val().toLowerCase().trim();
    
    $.post('/hints?' + $.param({hint: hint}), function(err) {
      console.log("posting hints")
      console.log(err)
      if (err) {
        $('.hint-input').attr("placeholder", err);
        $('.hint-input').val('');
        $('.hint-input').focus();
        setTimeout(function(){
          $('.hint-input').attr("placeholder", "hint for Santa");
        }, 2000);
      } else {
        
      $('<li></li>').text(hint).appendTo('ul#hints');  
      $('.hint-input').val('');
      $('.hint-input').focus();
        
      }
    });
  });
  
  // ask the server to submit a new email
  $('.new-email').submit(function(event) {
    
    event.preventDefault();
    console.log('asking the server')
    var query = {
      mail : $('.mail-input').val(),
      name : $('.name-input').val().toLowerCase().trim(),
      partner : $('.partner').val().toLowerCase().trim(),
      child : $('.child').val().toLowerCase().trim()
    }


    $.post('/address?' + $.param(query), function(err) {

      if (err) {
        console.log('got error from server')
        $('.mail-input').attr("placeholder", err);
        $('.mail-input').val('');
        $('.mail-input').focus();
        setTimeout(function(){
          $('.mail-input').attr("placeholder", "email");
        }, 2000);
        $('.name-input').val('');
      } else {
        
        $('.mail-input').attr("placeholder", "nice to have you!");
        $('input').val('');
        
        setTimeout(function(){
          $('.mail-input').attr("placeholder", "email");
        }, 2000);
        console.log("adding new participang")
        var displayNew = query.name;
        
        if(query.partner != ""){displayNew += (" (" + query.partner);
          if(query.child != ""){displayNew += (", " + query.child);}
          displayNew += ")";
                               }
                              
        $('<li></li>').text(displayNew).appendTo('ul#participants'); 
      }
    });
  });

});
