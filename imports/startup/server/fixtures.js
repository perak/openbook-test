Meteor.startup(function() {
	//
	// Users for testing
	//
	if(Meteor.roleAssignment.find({ "role._id": "admin" }).count() === 0) {
		let userId = Accounts.createUser({ email: "admin01@example.com", username: "admin01", password: "admin01" });

		Roles.setUserRoles(userId, "admin");
	}


	if(Meteor.roleAssignment.find({ "role._id": "user" }).count() === 0) {
		let userId = Accounts.createUser({ email: "user@example.com", username: "user01", password: "user01" });

		Roles.setUserRoles(userId, "user");
	}

});
