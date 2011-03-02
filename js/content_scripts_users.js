function getOptions(fn) {
	chrome.extension.sendRequest({id:'content_script_options'}, function(options){
		fn(options);
	});
}

function setOwnerIdButtonUserPage() {
	var ownerId = location.href.substring("http://atnd.org/users/".length);
	if (location.href.indexOf("http://atnd.org/users/show/") == 0) {
		ownerId = location.href.substring("http://atnd.org/users/show/".length);
	}
	if (isNaN(ownerId)) {
		return;
	}
	var obj = $('.title h1 img');
	if (obj.length != 1) {
		return;
	}
	var ownerNickname = obj.attr('alt').trim();
	getOptions(function (options) {
		var haveOwnerId = false;
		$.each(options.ownerList, function (i, owner){
			if (ownerId === owner.user_id) {
				haveOwnerId = true;
			}
		});
		if (!haveOwnerId) {
			$('.title h1').after(createAddButton(ownerId, ownerNickname));
		} else {
			$('.title h1').after(createRemoveButton(ownerId, ownerNickname));
		}
	});
}

function createRemoveButton(ownerId, ownerNickname) {
	var removeButton = $('<input type="button">').val('通知解除する').click(function (){
		chrome.extension.sendRequest({id:'content_script_ownerId', ownerId:ownerId, ownerNickname:ownerNickname, isDelete:true}, function(item){
			removeButton.replaceWith(createAddButton(ownerId, ownerNickname));
		});
	});
	return removeButton;
}

function createAddButton(ownerId, ownerNickname) {
	var addButton = $('<input type="button">').val('この人がイベントを作成したら通知する').click(function (){
		chrome.extension.sendRequest({id:'content_script_ownerId', ownerId:ownerId, ownerNickname:ownerNickname, isDelete:false}, function(item){
			addButton.replaceWith(createRemoveButton(ownerId, ownerNickname));
		});
	});
	return addButton;
}

setOwnerIdButtonUserPage();