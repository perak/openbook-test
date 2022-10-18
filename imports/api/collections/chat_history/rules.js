import { ChatHistory } from "/imports/api/collections/chat_history/collection.js";

ChatHistory.allow({
	insert: function (userId, doc) {
		return true;
	},

	update: function (userId, doc, fields, modifier) {
		return true;
	},

	remove: function (userId, doc) {
		return true;
	}
});

ChatHistory.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	if(!doc.createdBy) doc.createdBy = userId;

	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;
});

ChatHistory.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

});

ChatHistory.before.upsert(function(userId, selector, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

});

ChatHistory.before.remove(function(userId, doc) {

});

ChatHistory.after.insert(function(userId, doc) {

});

ChatHistory.after.update(function(userId, doc, fieldNames, modifier, options) {

});

ChatHistory.after.remove(function(userId, doc) {
});
