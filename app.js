try {
  simply.setText({
    title: 'FinApp!',
    body: 'No Pending Transactions'
  }, true);

  function statusUpdate() {
    ajax({ url: 'http://dorsk.powweb.com/finapp/message.php?token' + Pebble.getAccountToken() }, function (data) {
      if (data.length > 0) {
        clearInterval(ajaxIntervalId);
        authenticate_payment(data);
      } else {
        simply.off('singleClick');
        simply.off('accelTap');
      }
    });
  }

  // ajax interval call
  var ajaxIntervalId = setInterval(statusUpdate, 2000);

  function authenticate_payment(data) {
    simply.body(data);

    simply.on('singleClick', function (e) {
      var combo = localStorage.getItem('combo') || '';
      if (e.button === 'up') {
        combo += 't';
      } else if (e.button === 'select') {
        combo += 'm';
      } else if (e.button === 'down') {
        combo += 'b';
      }
      localStorage.setItem('combo', combo);
      var passwordRep = Array(combo.length + 1).join("*");
      simply.title("Enter secret");
      simply.body(passwordRep);

    });
    // Original PHP URL http://dorsk.powweb.com/finapp/process.php
    simply.on('accelTap', function (e) {
      var combo = localStorage.getItem('combo') || '';
      ajax({ url: 'http://requestb.in/uubczxuu?token' + Pebble.getAccountToken() + '&combo=' + combo }, function (data) {
        simply.body(data);
      });
      localStorage.setItem('combo', '');
      setTimeout(function() {
        ajaxIntervalId = setInterval(statusUpdate, 2000);
      }, 10000);

    });
  }
  // Original PHP URL http://dorsk.powweb.com/finapp/error.php
} catch(err) {
    ajax({ url: 'http://requestb.in/uubczxuu?error' + err.message }, function (data) {
    });
}