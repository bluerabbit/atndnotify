var EventMap = function(events) {
	var values = {};
	events.forEach(function(event, i) {
		values[event.event_id] = event;
	});
	this.values = values;
};
EventMap.prototype = {
	get: function(event_id) {
		return this.values[event_id];
	},
	put: function(event) {
		return this.values[event.event_id] = event;
	},
	toArray: function() {
		var list = [];
		var values = this.values;
		Object.keys(values).forEach(function(key) {
			list.push(values[key]);
		});
		return list;
	}
};
