import { Settings } from "/imports/api/collections/settings/collection.js";

Meteor.methods({
	"settingsInsert": function(data) {
		return Settings.insert(data);
	},

	"settingsUpdate": function(id, data) {
		return Settings.update( { _id: id }, { $set: data });
	},

	"settingsRemove": function(id) {
		return Settings.remove({ _id: id });
	},

	"settingsUpsert": function(selector, data) {
		return Settings.upsert( selector, { $set: data });
	}
});
