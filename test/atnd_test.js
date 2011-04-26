module('Atnd.js', {
	setup: function() {
	},
	teardown: function() {
	}
});

test('getEvent', function() {
	var atnd = new Atnd(1);
	var event = atnd.getEvent();
	console.log(event);
	ok(event != null);
	same(event.owner_id, 1);
	same(event.owner_nickname, 'knjko');
	same(event.owner_twitter_id, 'knjko');
	ok(event.title != null);
	ok(event.started_at != null);
	ok(event.ended_at != null);
	same(event.updated_at, '2011-03-02T14:08:53+09:00');
});

test('getStatus 出席', function() {
	var atnd = new Atnd(8889);
	var status = atnd.getStatus(6485); // bluerabbit 出席
	same(status, 1);
});

test('getStatus 参加していない', function() {
	var atnd = new Atnd(1);
	var status = atnd.getStatus(6485);
	same(status, null);
});

/*
test('getStatus キャンセル待ち', function () {
 	var atnd = new Atnd(8889);
 	var status = atnd.getStatus(6485);
 	same(status, 0);
});
*/

test('findByKeyword', function() {
	var events = Atnd.findByKeyword('java');
	ok(events != null);
});

test('findByUserId', function() {
	var events = Atnd.findByKeyword(6485);
	console.log(events);
	ok(events != null);
});

test('findByOwnerId', function() {
	var events = Atnd.findByOwnerId(6485);
	ok(events != null);
});

test('monthParameter', function() {
	same(Atnd.monthParameter(), '201104,201105');
});

test('filterIsNotEndedEventList', function() {
	var events = [];
	events.push({started_at: '2011-03-02T14:08:53+09:00',
	             ended_at: '2011-03-02T14:08:53+09:00'});
	events = Atnd.filterIsNotEndedEventList(events);
	same(events.length, 0);
	var now = new Date();
	now.setDate(now.getDate() + 1);
	var tomorrow = now;
	var start = tomorrow.toISOString().substring(0, now.toISOString().lastIndexOf('.')) + '+09:00';
	var end = tomorrow.toISOString().substring(0, now.toISOString().lastIndexOf('.')) + '+09:00';
	events.push({started_at: start,
	             ended_at: end});
	events = Atnd.filterIsNotEndedEventList(events);
	same(events.length, 1);
});

test('toDate', function() {
	var dateStr = '2011-03-02T14:08:53+09:00';
	var date = Atnd.toDate(dateStr);
	same(date.getDate(), 2);
	same(date.getMonth() + 1, 3);
	same(date.getFullYear(), 2011);

	date = Atnd.toDate('2010-10-13T19:30:00+09:00');
	same(date.getFullYear(), 2010, 'Year');
	same(date.getMonth() + 1, 10, 'Month');
	same(date.getDate(), 13, 'Date');
	same(date.getHours(), 19, 'Hours');
	same(date.getMinutes(), 30, 'Minutes');

});
