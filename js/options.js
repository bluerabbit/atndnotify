var Options = function (values, storageKey){
	this._storageKey = storageKey || 'options';
	values = values || {
		user_id:'',
		user_nickname:'',
		user_events:[],           // 参加しているイベント{event_id, title, status, updated_at, dateNotifiedList:[], (started_at, ended_at, owner_id, owner_nickname, accepted, limit, waiting, address, lon, lat)}
		timerMI:5,                // 監視間隔(分)
		autoCloseTimeSS:30,       // 通知ウィンドウを閉じるまでの時間(秒) 0の時は閉じない
		eventCalendarList:[],     // カレンダーに表示するイベント
		dateNotifyList:[3, 10],   // 何日前になったら備忘通知する
		keywordList:[],           // 検索キーワード
		keywordNotifiedList:[],   // 通知済みeventId
		ownerList:[],             // {user_id, nickname, updated_at}
		ownerNotifiedList:[],     // 通知済みeventId
		userCapacityNotifiedList:[],// 満席通知済みeventId
		schemaVersion:1
	};

	// migration
	values.user_nickname = values.user_nickname || '';
	values.user_events = values.user_events || [];
	values.dateNotifyList = values.dateNotifyList || [3, 10];
	values.timerMI = 5;
	values.autoCloseTimeSS = 30;
	values.userCapacityNotifiedList = values.userCapacityNotifiedList || [];

	var self = this;
	Object.keys(values).forEach(function(key){
		self[key] = values[key];
	});

	this.save();
};
Options.prototype = {
	save: function () {
		localStorage[this._storageKey] = JSON.stringify(this, function (key, value){
			if (key.indexOf('_') != 0) {
				return value;
			}
		});
	},
	reset: function () {
		localStorage.removeItem(this._storageKey);
	}
};
Options.load = function (storageKey) {
	storageKey = storageKey || 'options';
	if (localStorage.hasOwnProperty(storageKey)) {
		return new Options(JSON.parse(localStorage[storageKey]), storageKey);
	}
	return new Options(null, storageKey);
}
