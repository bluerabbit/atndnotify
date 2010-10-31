// ATNDの画面にボタンを埋め込む
function getOptions(fn) {
	chrome.extension.sendRequest({id:'content_script_options'}, function(options){
		fn(options);
	});
}

function setUserIdAndNickname() {
	var user = $(".header_logged a[href^='/users/'][href!='/users/profile']:first");
	if (user.length == 0) {
		return;
	}
	var userId = user.attr('href').replace('/users/', '');
	if (isNaN(userId)) {
		return;
	}
	chrome.extension.sendRequest({id:'content_script_userId', userId:userId, nickname:user.text()}, function(item){
	});
}

function setOwnerIdButton() {
	var owner = $(".info_layout a[href^='/users/'][href!='/users/profile']:first");
	if (owner.length == 0) {
		return;
	}
	var ownerId = owner.attr('href').replace('/users/', '');
	if (isNaN(ownerId)) {
		return;
	}
	var ownerNickname = owner.text();
	getOptions(function (options) {
		function createRemoveButton() {
			var removeButton = $('<input type="button">').val('通知解除する').click(function (){
				chrome.extension.sendRequest({id:'content_script_ownerId', ownerId:ownerId, ownerNickname:ownerNickname, isDelete:true}, function(item){
					alert('通知を解除しました。');
					removeButton.replaceWith(createAddButton());
				});
			});
			return removeButton;
		}
		function createAddButton() {
			var addButton = $('<input type="button">').val('この管理者のイベントは通知する').click(function (){
				chrome.extension.sendRequest({id:'content_script_ownerId', ownerId:ownerId, ownerNickname:ownerNickname, isDelete:false}, function(item){
					alert('この管理者が新規イベントを立てたら通知するように設定しました。');
					addButton.replaceWith(createRemoveButton());
				});
			});
			return addButton;
		}
		var haveOwnerId = false;
		$.each(options.ownerList, function (i, owner){
			if (ownerId === owner.user_id) {
				haveOwnerId = true;
			}
		});
		if (!haveOwnerId) {
			owner.after(createAddButton());
		} else {
			owner.after(createRemoveButton());
		}
	});
}
setUserIdAndNickname();
setOwnerIdButton();