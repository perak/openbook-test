this.rolesThatUserCanManage = function() {
	let currentUserRoles = Roles.getRolesForUser(Meteor.userId());

	function mergeArrays(arr1, arr2) {
		arr2.map(function(a) {
			if(arr1.indexOf(a) < 0) {
				arr1.push(a);
			}
		});
	}

	let allowedRoles = [];
	currentUserRoles.map(function(currentUserRole) {
		switch(currentUserRole) {
			case "admin": mergeArrays(allowedRoles, ["user"]); break;
		}
	});

	return allowedRoles;
};


this.extractUsersEmail = function(user) {
	if(!user || !user.emails || !user.emails.length) {
		return "";
	}

	let email = user.emails.find(email => !!email.verified);

	return email ? email.address : (user.emails && user.emails.length ? user.emails[0].address || "" : "");
};
