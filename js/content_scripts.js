// ATNDの画面にボタンを埋め込む
function getOptions(fn) {
	chrome.extension.sendRequest({id:'content_script_options'}, function(options){
		fn(options);
	});
}

function setUserIdButton() {
	var user = $(".header_logged a[href^='/users/'][href!='/users/profile']:first");
	if (user.length == 0) {
		return;
	}
	var userId = user.attr('href').replace('/users/', '');
	if (isNaN(userId)) {
		return;
	}
	var button = $('<input type="button">').click(function () {
		chrome.extension.sendRequest({id:'content_script_userId', userId:userId}, function(item){
			alert('ATND NotifyのユーザID[' + userId + "]を設定しました。");
		});
	});
	getOptions(function (options) {
		if (options.user_id == userId) {
			user.after($('<span>').text('(通知設定済み)'));
		} else {
			user.after(button.val('通知設定をする'));
		}
	});
}

function setEventIdButton() {
	var event_id = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
	if ($("#join_event").length == 0 || event_id.length == 0 || isNaN(event_id)) {
		return;
	}
	getOptions(function (options) {
		var haveEventId = false;
		$.each(options.eventList, function (i, e){
			if (event_id === e.event_id) {
				haveEventId = true;
			}
		});

		function createRemoveAnchor() {
			var removeAnchor = $('<a>').text('このイベントを通知解除する').click(function (){
				chrome.extension.sendRequest({id:'content_script_event_id', event_id:event_id, isDelete:true}, function(item){
					alert('このイベントの通知を解除しました。');
					removeAnchor.replaceWith(createAddAnchor());
				});
			});
			return removeAnchor;
		}
		function createAddAnchor() {
			var addAnchor = $('<a>').text('このイベントを通知する').click(function (){
				chrome.extension.sendRequest({id:'content_script_event_id', event_id:event_id, isDelete:false}, function(item){
					alert('このイベントに変更があったら通知するように設定しました。');
					addAnchor.replaceWith(createRemoveAnchor());
				});
			});
			return addAnchor;
		}
		var anchor;
		if (haveEventId) {
			anchor = createRemoveAnchor();
		} else {
			anchor = createAddAnchor();
		}
		var menu = $('.admin_menu li:first-child');
		if (menu.length == 0) {
			// 一般参加者
			$("#join_event").append($('<ul>').addClass('admin_menu').append($('<li>').append(anchor)));
		} else {
			// 管理イベント
			menu.before($('<li>').append(anchor));
		}
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
setUserIdButton();
setEventIdButton();
setOwnerIdButton();