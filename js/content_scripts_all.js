function getOptions(fn) {
	chrome.extension.sendRequest({id: 'content_script_options'}, function(options) {
		fn(options);
	});
}

//ログインしていたらUserIdをLocalStorageに保存する
function setUserIdAndNickname() {
	var user = $(".header-logged a[href^='/users/'][href!='/users/profile']:first");
	if (user.length == 0) {
		return;
	}
	var userId = user.attr('href').replace('/users/', '');
	if (isNaN(userId)) {
		return;
	}
	chrome.extension.sendRequest({id: 'content_script_userId', userId: userId, nickname: user.text()}, function(item) {
	});
}
setUserIdAndNickname();
