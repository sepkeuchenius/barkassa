var database = firebase.database();

window.onload = function(){
  $('#logo_img').hide()
  // $('#placeholder').effect('drop')
  window.setTimeout(function(){
    $('#placeholder').hide()
    $('#content').fadeIn()

  }, 500)

}

$('#login_button').on('click', function(){user_login()})

function user_login(){
  var username= $('#username').val()
  var pwd = $('#password').val()
  console.log(username)
  var userNumber = 0
   database.ref('users').once('value').then(function(snapshot){
      var data =  snapshot.val();
      // var copy_of_data = data
      data = Object.keys(data)
      for(var i in data){
        // console.log(data[i])
        if(username == data[i]){
          console.log(i)
          userNumber = Number(i);

        }
      }

      if(userNumber){
       database.ref('passwords').once('value').then(function(snapshot){
            var data =  snapshot.val();
            console.log(data)
            if(data[Number(userNumber)] == pwd ){
              // console.log('yes')
              loadUser(username)
              return;
            }
              alert('Foute wachtwoord')
          });

      }
      else{
      alert('Gebruiker bestaat niet')
    }
  });


}
function loadUser(user){
  $('#login_page').hide()
  $('#user_home').fadeIn()
  $('#logo_img').fadeIn()
  $('.mdl-layout__tab-bar-container').fadeIn()
   database.ref('users').child(user).once('value').then(function(snapshot){
     var data = snapshot.val()


  })

}
