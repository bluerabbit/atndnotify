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