module('Timer.js', {
  setup: function() {
  },
  teardown: function() {
  }
});


test('start', function() {
	var timer = new Timer(5000);
	var i = 0;
	timer.start(function() {
		i = i + 1;
		if (i == 2) {
			start();
			same(i, 2);
		}
	});
	stop();
});
