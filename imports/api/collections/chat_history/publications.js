import { Meteor } from "meteor/meteor";

import { ChatHistory } from "/imports/api/collections/chat_history/collection.js";

Meteor.publish("chat_history", function() {
	return ChatHistory.find({ createdBy: this.userId });
});
