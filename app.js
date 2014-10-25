console.log('Awesome Fin App!');


/*
 simply.on('singleClick', function(e) {
 console.log(util2.format('single clicked $button!', e));
 simply.subtitle('Pressed ' + e.button + '!');
 });
 */

/*
 simply.on('longClick', function(e) {
 console.log(util2.format('long clicked $button!', e));
 simply.vibe();
 simply.scrollable(e.button !== 'select');
 });
 */

/*
 simply.on('accelTap', function(e) {
 console.log(util2.format('tapped accel axis $axis $direction!', e));
 simply.subtitle('Tapped ' + (e.direction > 0 ? '+' : '-') + e.axis + '!');
 });
 */

simply.setText({
  title: 'FinApp!',
  body: 'No Pending Transactions'
}, true);

// Test Set Interval
/*setInterval(function() {
  ajax({ url: 'http://dorsk.powweb.com/finapp/count.php' }, function(data){
    simply.body(data);
  });
}, 2000);*/


// Real Set Interval
setInterval(function() {
  ajax({ url: 'http://dorsk.powweb.com/finapp/message.php' }, function(data){
    if(data.length > 0) {
      authenticate_payment(data);
    }
  });
}, 2000);


function authenticate_payment(data) {
  simply.body(data);

  setTimeout(function() {
    var combo = localStorage.getItem('combo') || '';
    ajax({ url: 'http://dorsk.powweb.com/finapp/process.php?combo=' + combo }, function(data){
      simply.body(data);
    });
  }, 15000);

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
}