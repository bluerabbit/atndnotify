var options;

module('Options.js', {
	setup: function() {
	  options = new Options.load('unit_test');
	},
	teardown: function() {
	  localStorage.removeItem('unit_test');
	}
});


test('load', function() {
	same(options.autoCloseTimeSS, 30);
});

test('save', function() {
	options.hoge = 'foo';
	options.save();
	options = JSON.parse(localStorage['unit_test']);
	same(options.hoge, 'foo');
});

test('save2', function() {
	var options = new Options.load('a');
	options.hoge = 'foo';
	options.save();
	options = JSON.parse(localStorage['a']);
	same(options.hoge, 'foo');
});

test('reset', function() {
	var options = new Options.load();
	same(options.hoge, undefined);
	options.hoge = 'foo';
	same(options.hoge, 'foo');
	options.save();
	options = new Options.load();
	same(options.hoge, 'foo');
	options.reset();
	options = new Options.load();
	same(options.hoge, undefined);
});
