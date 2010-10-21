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
	getStatus : function(user_id) {
		var result = null;
		$.ajax( {
			type : "GET",
			url : "http://api.atnd.org/events/users/",
			data : {
				"event_id" : this.event_id,
				"user_id" : user_id,
				"format" : "json"
			},
			dataType : "json",
			async : false,
			success : function(json) {
				if (json.results_returned == "1") {
					$.each(json.events[0].users, function (i, user) {
						if (user.user_id == user_id) {
							result = user.status;
						}
					});
				}
			}
		});
		return result;
	},
	find : function(param) {
		param['format'] = "json";
		// 直近三ヶ月を検索対象とする
		var date = new Date();
		param['ym'] = toYyyyMm(date) + ',' + toYyyyMm(nextMonth(date)) + ',' + toYyyyMm(nextMonth(date));

		function toYyyyMm(date) {
			var mm = date.getMonth() + 1;
			if (mm < 10) mm = "0" + mm;
			return String(date.getFullYear()) + mm;
		}

		function nextMonth(date) {
			date.setMonth(date.getMonth()+1);
			return date;
		}

		function toDate(str) {
			var yyyymmdd = str.substring(0, 10); // 2009-01-31
			var HhMiSS = str.substring(11, 18); // 20:44:34
			var time = Date.parse(yyyymmdd + " " + HhMiSS); // "2009/01/31 20:44:34"
			var date = new Date();
			date.setTime(time);
			return date;
		}

		var result = [];
		$.ajax( {
			type : "GET",
			url : "http://api.atnd.org/events/",
			data : param,
			dataType : "json",
			async : false,
			success : function(json) {
				var now = new Date();
				// 終わってるイベントは除く
				json.events.forEach(function (event, i) {
					var endDate = toDate(event.ended_at);
					if (now.getTime() < endDate.getTime()) {
						result.push(event);
					}
				});
			},
			error: function (xhr, errorText, error) {
				if (xhr.status == 200) {
					console.warn("Atnd.find error:" + errorText);
					console.warn(xhr);
					console.warn(error);
				}
			}
		});
		return result;
	}
};
