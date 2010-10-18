var Atnd = function(event_id) {
	this.event_id = event_id;
};
Atnd.prototype = {
	// result:json
	getEvent : function() {
		var result = null;
		$.ajax( {
			type : "GET",
			url : "http://api.atnd.org/events/",
			data : {
				"event_id" : this.event_id,
				"format" : "json"
			},
			dataType : "json",
			async : false,
			success : function(json) {
				if (json.results_returned == "1") {
					result = json.events[0];
				}
			},
			error: function (xhr, errorText, error) {
				if (xhr.status == 200) {
					console.warn("Atnd.getEvent error:" + errorText);
					console.warn(xhr);
					console.warn(error);
				}
			}
		});
		return result;
	},
	// result:status(1:出席、0:キャンセル待ち)
	getStatus : function(nickname) {
		var result = null;
		$.ajax( {
			type : "GET",
			url : "http://api.atnd.org/events/users/",
			data : {
				"event_id" : this.event_id,
				"nickname" : nickname,
				"format" : "json"
			},
			dataType : "json",
			async : false,
			success : function(json) {
				if (json.results_returned == "1") {
					$.each(json.events[0].users, function (i, user) {
						if (user.nickname == nickname) {
							result = user.status;
						}
					});
				}
			}
		});
		return result;
	}
};
