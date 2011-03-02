function getOptions(fn) {
	chrome.extension.sendRequest({id:'content_script_options'}, function(options){
		fn(options);
	});
}

// [この管理者のイベントは通知する]ボタンを追加する
function setOwnerIdButton() {
	var owner = $(".events-show-info a[href^='/users/'][href!='/users/profile']:first");
	if (owner.length == 0) {
		return;
	}
	var ownerId = owner.attr('href').replace('/users/', '');
	if (isNaN(ownerId)) {
		return;
	}
	var ownerNickname = owner.text();
	getOptions(function (options) {
		var haveOwnerId = false;
		$.each(options.ownerList, function (i, owner){
			if (ownerId === owner.user_id) {
				haveOwnerId = true;
			}
		});
		if (!haveOwnerId) {
			owner.after(createAddButton(ownerId, ownerNickname));
		} else {
			owner.after(createRemoveButton(ownerId, ownerNickname));
		}
	});
}
setOwnerIdButton();

// [経路案内]ボタンを追加する
function setTransitButton() {
	var eventLocation = $('.location span');
	if (eventLocation.length == 0 || eventLocation.text().length == 0) {
		return;
	}
	var toAddress = eventLocation.text().substring(1, eventLocation.text().length - 1);
	var frm = '<form id="googleTransitFrom" method="get" action="http://www.google.co.jp/transit" target="_blank">'
		+ '  <input type="hidden" id="fromAddress" name="saddr" value="" />'
		+ '  <input type="hidden" name="daddr" value="' + toAddress + '" />'
		+ '  <input type="hidden" name="date" value="" />'
		+ '  <input type="hidden" name="time" value="" />'
		+ '  <input type="hidden" name="ttype" value="arr" />'
		+ '  <input type="submit" id="googleTransit" value="経路案内">'
		+ '</form>';
	eventLocation.after($('<div>').html(frm));

	$('#googleTransit').click(function () {
		navigator.geolocation.getCurrentPosition(function(position) {
			chrome.extension.sendRequest({id:'getLatlngToAddress', lat:position.coords.latitude, lon:position.coords.longitude}, function(fromAddress){
				$('#fromAddress').val(fromAddress);
				location.href = "http://www.google.co.jp/transit?" + $('#googleTransitFrom').serialize();
			});
		}, function () {
			location.href = "http://www.google.co.jp/transit?" + $('#googleTransitFrom').serialize();
		});
		return false;
	});
}
setTransitButton();

function createRemoveButton(ownerId, ownerNickname) {
	var removeButton = $('<input type="button">').val('通知解除する').click(function (){
		chrome.extension.sendRequest({id:'content_script_ownerId', ownerId:ownerId, ownerNickname:ownerNickname, isDelete:true}, function(item){
			removeButton.replaceWith(createAddButton(ownerId, ownerNickname));
		});
	});
	return removeButton;
}
function createAddButton(ownerId, ownerNickname) {
	var addButton = $('<input type="button">').val('この管理者のイベントは通知する').click(function (){
		chrome.extension.sendRequest({id:'content_script_ownerId', ownerId:ownerId, ownerNickname:ownerNickname, isDelete:false}, function(item){
			addButton.replaceWith(createRemoveButton(ownerId, ownerNickname));
		});
	});
	return addButton;
}
