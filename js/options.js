var Options = function (values, storageKey){
	this._storageKey = storageKey || 'options';
	values = values || {
		user_id:'',
		timerMI:15,
		autoCloseTimeSS:30,
		eventList:[],
		eventCalendarList:[],
		notifyList:[1, 2, 3, 10],
		keywordList:[],
		keywordNotifiedList:[],
		ownerList:[], // {user_id:'', nickname:'', updated_at:''}
		ownerNotifiedList:[]
	};
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
