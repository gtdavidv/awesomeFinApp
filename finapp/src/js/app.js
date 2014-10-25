/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');
var Accel = require('ui/accel');
Accel.init();

var card = new UI.Card({
//  title: 'FinApp!',
//  body: 'No Pending Transactions',
  icon: 'images/qr_code.png'
});
card.show();

function statusUpdate() {
  console.log("Running status update");
  card.title('');
  card.body('');
  card.icon('images/qr_code.png');
  ajax({ url: 'http://dorsk.powweb.com/finapp/message.php?token=' + Pebble.getAccountToken() }, function (data) {
    if (data.indexOf("Payment") != -1) {
      console.log("Got payment prompt from server", data);
      clearInterval(ajaxIntervalId);
      authenticate_payment(data);
    } else if (data.indexOf("No combo") != -1) {
      console.log("Got no combo prompt from server", data);
      clearInterval(ajaxIntervalId);
      set_combo();
    } else {
      console.log("No Payment prompt from server", data);
    }
  });
}

// ajax interval call
var ajaxIntervalId = setInterval(statusUpdate, 2000);

function authenticate_payment(data) {
  console.log("Inside authenticate payment");
  card.body(data);
  card.icon(null);

  card.on('click', function (e) {
    var combo = localStorage.getItem('combo') || '';
    if (e.button === 'up') {
      combo += 't';
      console.log("Combo is ", combo);
    } else if (e.button === 'select') {
      combo += 'm';
      console.log("Combo is ", combo);
    } else if (e.button === 'down') {
      combo += 'b';
      console.log("Combo is ", combo);
    } else if (e.button === 'back') {
      combo = '';
      console.log("Combo is ", combo);
    }
    localStorage.setItem('combo', combo);
    var passwordRep = Array(combo.length + 1).join("*");
    card.title("Enter secret");
    card.body(passwordRep);
  });

  Accel.on('tap', function (e) {
    console.log("Inside accelTap function");
    var combo = localStorage.getItem('combo') || '';
    console.log("Combo is ", combo);
    ajax({ url: 'http://dorsk.powweb.com/finapp/process.php?token=' + Pebble.getAccountToken() + '&combo=' + combo }, function (data) {
      console.log("Inside accelTap ajax success");
      console.log("AccelTap data returned is ", data);
      card.title("Processed");
      card.body(data);
    });

    localStorage.setItem('combo', '');
    console.log("Reset combo to", localStorage.getItem('combo') );
    card.off('singleClick');
    card.off('accelTap');

    setTimeout(function() {
      console.log("Timeout to reset ajaxIntervalId completed");
      ajaxIntervalId = setInterval(statusUpdate, 2000);
    }, 10000);

  });
}

function set_combo(){
  var msg = 'Set your combo then shake.';
  card.body(msg);

  card.on('click', function(e) {
    var combo = localStorage.getItem('combo') || '';
    if (e.button === 'up') {
      combo += 't';
      console.log("Combo is ", combo);
    } else if (e.button === 'select') {
      combo += 'm';
      console.log("Combo is ", combo);
    } else if (e.button === 'down') {
      combo += 'b';
      console.log("Combo is ", combo);
    } else if (e.button === 'back') {
      combo = '';
      console.log("Combo is ", combo);
    }
    localStorage.setItem('combo', combo);
    var passwordRep = Array(combo.length + 1).join("*");
    card.title("Your Code");
    card.body(passwordRep);
  });

  Accel.on('tap', function(e) {
    console.log("Inside accelTap for combo set");
    var combo = localStorage.getItem('combo') || '';
    console.log("Combo is ", combo);
    ajax({ url: 'http://dorsk.powweb.com/finapp/newcombo.php?token=' + Pebble.getAccountToken() + '&combo=' + combo }, function(data){
      card.title("Set!");
      card.body(data);
    });

    card.off('singleClick');
    card.off('accelTap');
    localStorage.setItem('combo', '');

    setTimeout(function() {
      console.log("Timeout to reset ajaxIntervalId completed");
      ajaxIntervalId = setInterval(statusUpdate, 2000);
    }, 10000);
  });
}
