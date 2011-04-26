var assert = function(condition, opt_message) {
    if (assert.DEBUG && !condition) {
      console.assert(condition, opt_message);
      if (console.trace) console.trace();
      if (Error().stack) console.log(Error().stack);
      debugger;
    }
};

assert.DEBUG = false;

assert.setDebugMode = function() {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var manifest = JSON.parse(xhr.responseText);
    if (manifest.key == undefined) {
      // Development Mode
      assert.DEBUG = true;
    }
  };
  xhr.open('GET', chrome.extension.getURL('manifest.json'), true);
  xhr.send(null);
};

assert.setDebugMode();
