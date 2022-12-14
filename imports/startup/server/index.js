import "./accounts.js";
import "./collections.js";
import "./openbook.js";
import "./fixtures.js";

Meteor.startup(function() {
	// read environment variables from Meteor.settings
	if(Meteor.settings && Meteor.settings.env) {
		for(var variableName in Meteor.settings.env) {
			process.env[variableName] = Meteor.settings.env[variableName];
		}
	}
});
