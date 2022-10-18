import { Meteor } from "meteor/meteor";

import { BookTest } from "/imports/api/collections/book_test/collection.js";

Meteor.publish("book_test", function() {
	return BookTest.find({ createdBy: this.userId });
});
