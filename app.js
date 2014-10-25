try {
  simply.setText({
    title: 'FinApp!',
    body: 'No Pending Transactions'
  }, true);

  function statusUpdate() {
    console.log("Running status update");
    ajax({ url: 'http://dorsk.powweb.com/finapp/message.php?token=' + Pebble.getAccountToken() }, function (data) {
      if (data.length > 0) {
        console.log("Got prompt from server", data);
        clearInterval(ajaxIntervalId);
        authenticate_payment(data);
      } else {
        console.log("No Payment prompt from server", data);
        simply.off('singleClick');
        simply.off('accelTap');
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
    // Original PHP URL http://dorsk.powweb.com/finapp/process.php
    simply.on('accelTap', function (e) {
      console.log("Inside accelTap function");
      var combo = localStorage.getItem('combo') || '';
      console.log("Combo is ", combo);
      ajax({ url: 'http://requestb.in/uubczxuu?token=' + Pebble.getAccountToken() + '&combo=' + combo }, function (data) {
        console.log("Inside accelTap ajax success");
        console.log("AccelTap data returned is ", data);
        simply.body(data);
      });
      localStorage.setItem('combo', '');
      console.log("Reset combo to", localStorage.getItem('combo') );
      setTimeout(function() {
        console.log("Timeout to reset ajaxIntervalId completed");
        ajaxIntervalId = setInterval(statusUpdate, 2000);
      }, 10000);

    });
  }
  // Original PHP URL http://dorsk.powweb.com/finapp/error.php
} catch(err) {
    console.log("Error", err.message);
    ajax({ url: 'http://requestb.in/uubczxuu?error=' + err.message }, function (data) {
    });
}