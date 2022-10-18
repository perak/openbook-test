import { BookTest } from "/imports/api/collections/book_test/collection.js";

BookTest.allow({
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

BookTest.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	if(!doc.createdBy) doc.createdBy = userId;

	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;
});

BookTest.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

});

BookTest.before.upsert(function(userId, selector, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

});

BookTest.before.remove(function(userId, doc) {

});

BookTest.after.insert(function(userId, doc) {

});

BookTest.after.update(function(userId, doc, fieldNames, modifier, options) {

});

BookTest.after.remove(function(userId, doc) {
});
