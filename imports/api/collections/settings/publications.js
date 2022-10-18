import { Meteor } from "meteor/meteor";

import { Settings } from "/imports/api/collections/settings/collection.js";

Meteor.publish("settings", function() {
	if(!Roles.userIsInRole(this.userId, ["admin" ])) {
		return this.ready();
	}

	return Settings.find({}, { sort: { createdAt: -1 }}, { limit: 1 });
});
