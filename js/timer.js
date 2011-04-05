var Timer = function(delay, fn) {
    this._id = 'Timer/' + new Date().getTime();
    this._delay = parseInt(delay);
    this._fn = fn;
};
Timer.prototype = {
    start: function(fn) {
        fn = this._fn = fn || this._fn;
        sessionStorage[this._id + '/enabled'] = 'true';
        var delay = this._delay;
        var storageKey = this._id;
        var enabled = this._id + '/enabled';
        (function loop() {
            if (sessionStorage[enabled] != 'true') {
                return;
            }
            var timerId = setTimeout(function() {
                fn();
                loop();
            }, delay);
            sessionStorage[storageKey] = timerId;
        })();

        setTimeout(fn, 1000);
    },
    stop: function() {
        sessionStorage[this._id + '/enabled'] = 'false';
        clearTimeout(sessionStorage[this._id]);
    },
    restart: function() {
        console.log('restart');
        if (this._fn) {
            this.stop();
            this.start();
        }
    }
};
