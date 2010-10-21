var Timer = function (delay){
	this._id = "Timer/" + new Date().getTime();
	this._delay = parseInt(delay);
}
Timer.prototype = {
	start: function (fn) {
		sessionStorage[this._id + "/enabled"] = "true";
		var delay = this._delay;
		var storageKey = this._id;
		var enabled = this._id + "/enabled";
		(function loop(){
			if (sessionStorage[enabled] != "true") {
				return;
			}
			var timerId = setTimeout(function(){
				fn();
				loop();
			}, delay);
			sessionStorage[storageKey] = timerId;
		})();
		var timerId = setTimeout(function(){
			fn();
		}, 100);
		sessionStorage[storageKey] = timerId;
	},
	stop: function () {
		sessionStorage[this._id + "/enabled"] = "false";
		clearTimeout(sessionStorage[this._id]);
	}
}