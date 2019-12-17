//TODO
//add users
//user search function
//history keeping
//reset button
//redesign bill
//manual buttons


//uservars
var snackbarContainer = document.querySelector('#demo-snackbar-example');
var activeUser = [];
var currentUser = '';
var products = []; //Firebase Database
var users = []; //Firebase Database
var productNames = []; //Firebase Database
var productPrices = []; //Firebase Database
var del = 1;
var mult = 1;
var loader = true;



//database variables
var database = firebase.database();
database.ref('Products/').once('value').then(function(snapshot){
  var data =  snapshot.val();
  products = data
  console.log(products)
})
database.ref('Product_names/').once('value').then(function(snapshot){
  productNames = snapshot.val()
})
database.ref('Product_prices/').once('value').then(function(snapshot){
  productPrices = snapshot.val()
})


//button functions
function multiplier(el){
  if(mult == Number(el.attr('id').substring(1))){
    mult = 1
    el.css('box-shadow', 'none')
  }
  else{
    mult = Number(el.attr('id').substring(1))
    el.css('box-shadow', '0 0 20px red')
  }
}
function deleter(){
  if(del == 1){
    del =-1
    $('#kassa').css('background', 'rgb(253, 114, 114)')
  }
  else{
    del = 1
    $('#kassa').css('background', '#ebebeb')
  }
}

//loader function
function load(){
  if(loader){
    loader = false;
    $('#p2').hide()
  }
  else{
    load = true;
    $('#p2').show()
  }
}


//load users
database.ref('users').once('value').then(function(snapshot){
  var data =  snapshot.val();
  users = Object.keys(data)
  $.each(users, function(i,x){
    //x is user name
    // $item = $('<a class="mdl-navigation__link user" id="a_' + x + '">' + x+  ' <i class="material-icons" style="vertical-align: middle; float: right;" onclick="removeUser($(this))">delete</i></a>')
    // $('.mdl-navigation').append($item)
  })
  load()

  $('.user').on('click', function(){
    currentUser = $(this).attr('id').substring(2)
    $('#usertitle').html(' &rarr; ' + currentUser)

    loadBill()
    $(this).detach().prependTo('.mdl-navigation')
  })
})

//reload billlist
function loadBill(){
  database.ref('users/' + currentUser).once('value').then(function(snapshot){
    var data =  snapshot.val();
    $('#billList').empty()
    var due = 0;
    for(var i in data){
      if(data[i] > 0){
        $('#billList').append('<li class="mdl-list__item"> ' + productNames[i] + ' : ' + data[i])
        due += data[i] * productPrices[i]
      }
    }
    $('#due-amount').text(due.toFixed(2))
  })
}

//button clicks
$('.product').on('click', function(){
  var product = $(this).attr('id')

//find i for the addition
  for(var i in products){
    if(product == products[i]){
      console.log(products[i])
      break;
    }
  }
  database.ref('users/' + currentUser).once('value').then(function(snapshot){
    var userdata = snapshot.val()
    // var userdata = data.currentUser
    var msg = mult +' '+ products[i] + ' toegevoegd'
    userdata[i] = userdata[i] + 1 * del * mult;
    if(del == -1){
        msg = mult +' '+ products[i] + ' verwijderd'
    deleter()
  }

  var data = {
     message: msg,
     timeout: 3000,
     actionText: 'Undo'
   };
   snackbarContainer.MaterialSnackbar.showSnackbar(data);
  if(mult != 1){
    mult = 1;
    $('.multi').css('box-shadow', 'none')
  }
    console.log(userdata)
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

})


function clearCart(){
  if(currentUser.length < 1 || prompt('Code') != 5831 || !confirm('Zeker weten?')){
    alert('Afgebroken')
    return;
  }
  var newar = [];
  for(var i in products){
    newar.push(0)
  }
  database.ref('users/' + currentUser).set(newar);
  loadBill()

}

function removeUser(el){
  if(prompt('Code') != 5831 || !confirm('Zeker weten?')){
    alert('Afgebroken')
    return;
  }
el.parent().remove()


} //just removing the element for now, database comes later
