var database = firebase.database();
var products;
var prices;
database.ref('Products').once('value').then(function(snapshot){
  var data = snapshot.val()
  products = data;
})
database.ref('Product_prices').once('value').then(function(snapshot){
  var data = snapshot.val()
  prices = data;
})
window.onload = function(){
  $('#logo_img').hide()
  // $('#placeholder').effect('drop')
  window.setTimeout(function(){
    $('#placeholder').hide()
    $('#content').fadeIn()

  }, 500)

}
$('#abestelling, #tab1').on('click', function(){pageLoad('bestelling', 'tab1')});
$('#arekening, #tab2').on('click', function(){pageLoad('rekening', 'tab2')});
$('#ageschiedenis, #tab3').on('click', function(){pageLoad('geschiedenis', 'tab3')});
// $('#arec , #tab4').on('click', function(){pageLoad('recordsCard', 'tab4')});
function pageLoad(page, tab){
  var pages = ['bestelling', 'rekening', 'geschiedenis']
  var tabs = ['tab1', 'tab2', 'tab3', 'tab4']
  for(var i in pages){
    $('#' + pages[i]).hide();
  }
  for(var i in tabs){
    $('#' + tabs[i]).attr('class', 'mdl-layout__tab')
  }
  $('#' + page).fadeIn(1000)
  $('#' + tab).attr('class', 'mdl-layout__tab is-active');
  // $('.mdl-layout__drawer').toggleClass('is-visible');
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
     var total = 0
     for(var d in data){
       var q = data[d]
       var p = q * prices[d]
       total += p;
     }
     $('#userTotal').text('\u20AC' + total.toFixed(2))
  })


}
