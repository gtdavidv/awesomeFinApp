try {
  simply.setText({
    title: 'FinApp!',
    body: 'No Pending Transactions'
  }, true);

  function statusUpdate() {
    console.log("Running status update");
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
    simply.body(data);

    simply.on('singleClick', function (e) {
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
      }
      localStorage.setItem('combo', combo);
      var passwordRep = Array(combo.length + 1).join("*");
      simply.title("Enter secret");
      simply.body(passwordRep);

    });
    simply.on('accelTap', function (e) {
      console.log("Inside accelTap function");
      var combo = localStorage.getItem('combo') || '';
      console.log("Combo is ", combo);
      ajax({ url: 'http://dorsk.powweb.com/finapp/process.php?token=' + Pebble.getAccountToken() + '&combo=' + combo }, function (data) {
        console.log("Inside accelTap ajax success");
        console.log("AccelTap data returned is ", data);
        simply.title("Processed");
        simply.body(data);
      });
      localStorage.setItem('combo', '');
      console.log("Reset combo to", localStorage.getItem('combo') );
      simply.off('singleClick');
      simply.off('accelTap');
      setTimeout(function() {
        console.log("Timeout to reset ajaxIntervalId completed");
        ajaxIntervalId = setInterval(statusUpdate, 2000);
      }, 10000);

    });
  }

  function set_combo(){
    var msg = 'First log in. Set your combo then shake.';
    simply.body(msg);

    simply.on('singleClick', function(e) {
      var combo = localStorage.getItem('combo') || '';
      if (e.button === 'up') {
        combo += 't';
      } else if (e.button === 'select') {
        combo += 'm';
      } else if (e.button === 'down') {
        combo += 'b';
      }
      localStorage.setItem('combo', combo);
    });

    simply.on('accelTap', function(e) {
      var combo = localStorage.getItem('combo') || '';
      ajax({ url: 'http://dorsk.powweb.com/finapp/newcombo.php?token=' + Pebble.getAccountToken() + '&combo=' + combo }, function(data){
        simply.body(data);
      });
      localStorage.setItem('combo', '');

      setInterval(function(){ statusUpdate(); }, 2000);
    });
  }

  // Original PHP URL http://dorsk.powweb.com/finapp/error.php
} catch(err) {
    console.log("Error", err.message);
    ajax({ url: 'http://requestb.in/uubczxuu?error=' + err.message }, function (data) {
    });
}