import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Roles } from "meteor/alanning:roles";


const roles = [ "user", "admin" ];


const createRoles = function(roleNames) {
	let existingRoles = [];
	Roles.getAllRoles().forEach(function(role) {
		existingRoles.push(role._id);
	});

	roleNames.map(function(roleName) {
		if(existingRoles.indexOf(roleName) < 0) {
			Roles.createRole(roleName);
		}
	});
};

createRoles(roles);


Accounts.config({
	forbidClientAccountCreation: true,
	sendVerificationEmail: true
});

Accounts.urls.enrollAccount = function(token) {
	return Meteor.absoluteUrl("create_password/" + token);
};

Accounts.urls.resetPassword = function(token) {
	return Meteor.absoluteUrl("create_password/" + token);
};


Accounts.onCreateUser(function(options, user) {
	let role = options.role || "user";

	// Set user's role
	Roles.setUserRoles(user._id, role);

	return user;
});


Meteor.methods({
	"sendResetPasswordEmail": function(email) {
		check(email, String);

		let user = Accounts.findUserByEmail(email);
		if(!user) {
			throw new Meteor.Error(404, "User with email \"" + email + "\" is not found.");
		}

		Accounts.sendResetPasswordEmail(user._id, email);
	}
});


// Publish users roles to client

Meteor.publish(null, function () {
	if(this.userId) {
		// Admin: publish all role assignments
		if(Roles.userIsInRole(this.userId, ["admin"])) {
			return Meteor.roleAssignment.find({});
		}

		// publish only this user's role assignments
		return Meteor.roleAssignment.find({ "user._id": this.userId });
	} else {
		this.ready()
	}
});
