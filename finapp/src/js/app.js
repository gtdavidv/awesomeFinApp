/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');
var Accel = require('ui/accel');
var accelActive = false;
var Vibe = require('ui/vibe');
Accel.init();

var card = new UI.Card({
  banner: 'images/qr_code.png'
});
card.show();

function statusUpdate() {
  console.log("Running status update");
//  card.title('');
//  card.body('');
  ajax({ url: 'http://dorsk.powweb.com/finapp/message.php?token=' + Pebble.getAccountToken() }, function (data) {
    if (data.indexOf("Payment") != -1) {
      console.log("Got payment prompt from server");
      console.log(data);
      clearInterval(ajaxIntervalId);
      authenticate_payment(data);
    } else if (data.indexOf("No combo") != -1) {
      console.log("Got no combo prompt from server");
      console.log(data);
      clearInterval(ajaxIntervalId);
      set_combo();
    } else {
      console.log("No Payment prompt from server", data);
    }
  });
}

// ajax interval call
var ajaxIntervalId = setInterval(statusUpdate, 4000);

function authenticate_payment(data) {
  card = new UI.Card({
//  title: 'FinApp!',
//  body: 'No Pending Transactions',
//    banner: 'images/qr_code.png'
  });
  card.show();
  console.log("Inside authenticate payment");
  card.body(data);
  localStorage.setItem('combo', '');
  accelActive = true;

  var passwordClearInterval = setInterval(function() {
    var combo = localStorage.getItem('combo') || '';
    localStorage.setItem('combo', '');
    card.body('');
  }, 10000);

  card.on('click', function (e) {
    var combo = localStorage.getItem('combo') || '';
    if (e.button === 'up') {
      combo += 't';
      console.log("Combo is ");
      console.log(combo);
    } else if (e.button === 'select') {
      combo += 'm';
      console.log("Combo is ");
      console.log(combo);
    } else if (e.button === 'down') {
      combo += 'b';
      console.log("Combo is");
      console.log(combo);
    }
    localStorage.setItem('combo', combo);
    var passwordRep = Array(combo.length + 1).join("*");
    card.title("Enter secret");
    card.body(passwordRep);
  });


  Accel.on('tap', function (e) {
    if (accelActive) {
      clearInterval(passwordClearInterval);
      console.log("Inside accelTap function");
      var combo = localStorage.getItem('combo') || '';
      console.log("Combo is " + combo);
      var coords = "";
      navigator.geolocation.getCurrentPosition(function(pos) {
        coords = pos.coords;
        console.log("Latitude is ");
        console.log(coords.latitude);
        console.log("Longitude is ");
        console.log(coords.longitude);
      });
      ajax({ url: 'http://dorsk.powweb.com/finapp/process.php?token=' + Pebble.getAccountToken() + '&combo=' + combo  + '&long=' + coords.longitude + '&lat=' + coords.latitude}, function (data) {
        console.log("Inside accelTap ajax success");
        console.log("AccelTap data returned is ");
        console.log(data);
        if (data == "Succeeded") {
          var card = new UI.Card({
            banner: 'images/check_icon.png'
          });
          card.show();
        } else if (data == "Failed") {
          var card = new UI.Card({
            banner: 'images/close_icon.png'
          });
          card.show();
        }


      });

      localStorage.setItem('combo', '');

      setTimeout(function() {
        console.log("Timeout to reset ajaxIntervalId completed");
        card = new UI.Card({
//  title: 'FinApp!',
//  body: 'No Pending Transactions',
          banner: 'images/qr_code.png'
        });
        card.show();
        ajaxIntervalId = setInterval(statusUpdate, 4000);
      }, 8000);
    }
    accelActive = false;
  });
}

function set_combo(){
  var msg = 'Set your combo then shake.';
  card.body(msg);

  card.on('click', function(e) {
    var combo = localStorage.getItem('combo') || '';
    if (e.button === 'up') {
      combo += 't';
      console.log("Combo is ");
      console.log(combo);
    } else if (e.button === 'select') {
      combo += 'm';
      console.log("Combo is ");
      console.log(combo);
    } else if (e.button === 'down') {
      combo += 'b';
      console.log("Combo is ");
      console.log(combo);
    } else if (e.button === 'back') {
      combo = '';
      console.log("Combo is ");
      console.log(combo);
    }
    localStorage.setItem('combo', combo);
    var passwordRep = Array(combo.length + 1).join("*");
    card.title("Your Code");
    card.body(passwordRep);
  });

  Accel.on('tap', function(e) {
    console.log("Inside accelTap for combo set");
    var combo = localStorage.getItem('combo') || '';
    console.log("Combo is ");
    console.log(combo);

    ajax({ url: 'http://dorsk.powweb.com/finapp/newcombo.php?token=' + Pebble.getAccountToken() + '&combo=' + combo}, function(data){
      card.title("Set!");
      card.body(data);
    });

    localStorage.setItem('combo', '');

    setTimeout(function() {
      console.log("Timeout to reset ajaxIntervalId completed");
      ajaxIntervalId = setInterval(statusUpdate, 4000);
    }, 8000);
  });
}
