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
	}
};

Atnd.findByKeyword = function(keyword) {
	var date = new Date();
	// 直近三ヶ月を検索対象とする
	var param = {
			keyword: keyword,
			format: 'json',
			ym: toYyyyMm(date) + ',' + toYyyyMm(nextMonth(date)) + ',' + toYyyyMm(nextMonth(date))
	};
	function toYyyyMm(date) {
		var mm = date.getMonth() + 1;
		if (mm < 10) mm = "0" + mm;
		return String(date.getFullYear()) + mm;
	}

	function nextMonth(date) {
		date.setMonth(date.getMonth()+1);
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
			// 終了したイベントは検索結果に含まない
			result = Atnd.isNotEndedEventList(json.events);
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


Atnd.findByOwnerId = function(ownerId) {
	var result = [];
	$.ajax( {
		type : "GET",
		url : "http://api.atnd.org/events/",
		data : {
			"owner_id" : ownerId,
			"format" : "json"
		},
		dataType : "json",
		async : false,
		success : function(json) {
			result = Atnd.isNotEndedEventList(json.events);
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

Atnd.isNotEndedEventList = function (events) {
	var now = new Date();
	var result = [];
	// 終了したイベントは検索結果に含まない
	events.forEach(function (event, i) {
		if (!event.ended_at) {
			// 終了日が設定されていないイベントは開始日から三日経過してたら終わった事にする
			var endTime = Atnd.toDate(event.started_at).getTime() + (1000 * 60 * 60 * 24 * 3);
			if (now.getTime() < endTime) {
				result.push(event);
			}
			return;
		}
		var endDate = Atnd.toDate(event.ended_at);
		if (now.getTime() < endDate.getTime()) {
			result.push(event);
		}
	});
	return result;
}

//ATND APIレスポンスの日付文字列（started_at, ended_at ..etc)[yyyy-mm-ddThh:mi:ss+09:00]をDate型に変換する
Atnd.toDate = function toDate(str) {
	var yyyymmdd = str.substring(0, 10);
	var HhMiSS = str.substring(11, 19);
	var time = Date.parse(yyyymmdd + " " + HhMiSS);
	var date = new Date();
	date.setTime(time);
	return date;
}