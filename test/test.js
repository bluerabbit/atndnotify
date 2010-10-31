module("setup", {
	setup: function() {
	},
	teardown: function () {
	}
});

test("Atnd.toDate", function() {
	var date = Atnd.toDate("2010-10-13T19:30:00+09:00");
	same(date.getFullYear(), 2010, "Year");
	same(date.getMonth()+1, 10, "Month");
	same(date.getDate(), 13, "Date");
	same(date.getHours(), 19, "Hours");
	same(date.getMinutes(), 30, "Minutes");
});

test("ステータスが変わっていたら更新する", function() {
	var events = [];
	for (var i = 0; i < 5; i++) {
		var event = {event_id:i, title:'title' + i, status:1, updated_at:'2010-09-30T19:38:40+09:00'};
		events.push(event);
	}
	var user_events = [{event_id:0, title:'title0', status:0, updated_at:'2010-09-30T19:38:40+09:00'}];
	var map = new EventMap(user_events);
	events.forEach(function (event) {
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


