var database = firebase.database();
var products;
var productNames;
var prices;
var currentUser;
var snackbarContainer = document.querySelector('#demo-snackbar-example');

database.ref('Products').once('value').then(function(snapshot){
  var data = snapshot.val()
  products = data;
})

database.ref('Product_prices').once('value').then(function(snapshot){
  var data = snapshot.val()
  prices = data;
})
database.ref('Product_names').once('value').then(function(snapshot){
  var data = snapshot.val()
  productNames = data;
})
window.onload = function(){
 $('.popup').find('button').on('click', function(){
   var parent_card = $(this).parent().parent();
   var parent_id = parent_card.attr('id')
   var n = parent_card.find('.aantal').children().first().val()
   n = Number(n)
   var product = parent_id.replace('popup', '')

   for(var i in products){ if(product == products[i]){break}}
   console.log(i)
   database.ref('users/' + currentUser).once('value').then(function(snapshot){
     var userdata = snapshot.val()
     // var userdata = data.currentUser
     var msg = n +' '+ products[i] + ' toegevoegd'
     userdata[i] = userdata[i] + n;
     if(n < 0 ){
         msg = -1*n +' '+ products[i] + ' verwijderd'
   }

   var data = {
      message: msg,
      timeout: 3000,
      actionText: 'Undo'
    };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
     database.ref('users/' + currentUser).set(userdata,
        function(error){
         if(error){
           alert('wow, niet gelukt!')
         }
         else{
           loadBill()
         // productSucces()
         }
       }

     );
   })

  database.ref('Log').push({"date": moment().format('DD-MM-YYYY, HH:mm:ss'), "amount": n, "product": products[i], "user":currentUser, "deviceInfo": window.navigator.userAgent})
 })
  $(".down").on('click', function(){
    var next = $(this).next().children().first()
    next.val(Number(Number(next.val()) - 1))
    if(next.val() < 0){
      $(this).parent().parent().find('button').css('background', '#ff6e6e')
    }
    else{
      $(this).parent().parent().find('button').css('background', '#6ece6e')
    }
  })
  $(".up").on('click', function(){
    var next = $(this).prev().children().first()
    next.val(Number(Number(next.val()) + 1))
    if(next.val() < 0){
      $(this).parent().parent().find('button').css('background', '#ff6e6e')
    }
    else{
      $(this).parent().parent().find('button').css('background', '#6ece6e')
    }
  })
  $('#back').on('click', function(){
    $('.popup').each(function(){
      if($(this).is(':visible')){
        $(this).hide('slide', 100)
      }
    })
    // $('.popup').hide('slide', 200)
    // $('.popup').hide()
    $('#back').hide();
  })
  $('#popup').hide();
  // $('#logo_img').hide()
  // $('#placeholder').effect('drop')
  window.setTimeout(function(){
    $('#placeholder').hide()
    $('#content').fadeIn()

  }, 500)
  $('.product').on('click', function(){
    // alert('test')
    var id = this.id
    var popups = $('.popup')
    var hide = false;
    popups.each(function(){
      var el = $( this )
      if(el.css('display') != 'none'){
        el.hide()
        hide = true;
        return;
      }
    })
    if(hide){return;}
    $('#popup' + id).effect('slide', 200);
    $('#back').show()
  })
}
pageLoad('bestelling', 'tab1')
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
  currentUser = user;
  $('#login_page').hide()
  $('#user_home').fadeIn()
  $('#logo_img').fadeIn()
  $('.mdl-layout__tab-bar-container').fadeIn()
  loadBill()


}
function loadBill(){
  var user = currentUser
  var t;
  database.ref('users').child(user).once('value').then(function(snapshot){
    var data = snapshot.val()
    var total = 0
    for(var d in data){
      var q = data[d]
      var p = q * prices[d]
      total += p;
    }
    $('#userTotal').text('\u20AC' + total.toFixed(2))
    $('#userTotal').effect('highlight', 1000)
    t = total
 })
 database.ref('users/' + currentUser).once('value').then(function(snapshot){
   var data =  snapshot.val();
   $('#billList').empty()
   var due = 0;
   for(var i in data){
     if(data[i] > 0){
       $('#billList').append('<li class="mdl-list__item"> ' + productNames[i] + '<span class="right_item">' + data[i] + '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp   \u20AC' + prices[i].toFixed(2)  + '</span>')
       due += prices[i] * data[i]
     }
   }
   $('#billList').append('<li class="mdl-list__item" style= "font-weight:bold;">  Total  <span class="right_item"> ' + '\u20AC' + due.toFixed(2)  + '</span>')

 })
}
