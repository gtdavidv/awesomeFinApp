/*
When pinging message.php, if you get a response "No combo" then turn off the interval calling message.php and call this function.
*/

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
		ajax({ url: 'http://dorsk.powweb.com/finapp/newcombo.php?token' + Pebble.getAccountToken() + '&combo=' + combo }, function(data){
			simply.body(data);
		});
		localStorage.setItem('combo', '');
		
		setInterval(function(){ statusUpdate(); }, 2000);
	});
}