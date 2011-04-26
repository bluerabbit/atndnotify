var events;

module('EventMap.js', {
  setup: function() {
    events = [{event_id: 1, title: 'a'}, {event_id: 2, title: 'b'}];
  },
  teardown: function() {
		events = null;
  }
});

test('toArray', function() {
	var map = new EventMap(events);
	ok(map.toArray().length == events.length);
});

test('put', function() {
	var map = new EventMap(events);
	map.put({event_id: 3, title: 'c'});
	var array = map.toArray();
	same(array.length, 3);
	same(array[0].event_id, events[0].event_id);
	same(events.length, 2);
});

test('get', function() {
	var map = new EventMap(events);
	same(map.get(1).title, 'a');
	same(map.get(2).title, 'b');
	ok(map.get(9) == null);
});

test('ステータスが変わっていたら更新する', function() {
	var events = [];
	for (var i = 0; i < 5; i++) {
		var event = {event_id: i, title: 'title' + i, status: 1, updated_at: '2010-09-30T19:38:40+09:00'};
		events.push(event);
	}
	var user_events = [{event_id: 0, title: 'title0', status: 0, updated_at: '2010-09-30T19:38:40+09:00'}];
	var map = new EventMap(user_events);
	events.forEach(function(event) {
		var userEvent = map.get(event.event_id);
		if (userEvent == null) {
			map.put(event);
		} else if (userEvent.status == 0 && event.status == 1) {
			userEvent.status = 1;
		}
	});
	user_events = map.toArray();

	same(user_events.length, 5);
	same(user_events[0].status, 1);
});
