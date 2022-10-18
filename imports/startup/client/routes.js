import "/imports/ui/layouts/master_layout.js";


import "/imports/ui/pages/login/login.js";
import "/imports/ui/pages/create_password/create_password.js";
import "/imports/ui/pages/reset_password/reset_password.js";


import "/imports/ui/pages/chat/chat.js";
import "/imports/ui/pages/test/test.js";


import "/imports/ui/pages/user/user.js";
import "/imports/ui/pages/user/profile/profile.js";




import "/imports/ui/pages/not_found/not_found.js";


export const routeMap = [
	{ name: "login", url: "/", access: ["public"], title: "Login", layout: "MasterLayout", template: "Login" },

	{ name: "create_password", url: "/create_password/:token", access: ["public"], title: "Create Password", layout: "MasterLayout", template: "CreatePassword" },
	{ name: "reset_password", url: "/reset_password/", access: ["public"], title: "Reset Password", layout: "MasterLayout", template: "ResetPassword" },

	{ name: "chat", url: "/chat", access: ["private"], layout: "MasterLayout", template: "Chat" },
	{ name: "test", url: "/test", access: ["private"], layout: "MasterLayout", template: "Test" },

	{ name: "user", url: "/user", access: ["private"], layout: "MasterLayout", template: "User" },
	{ name: "user.profile", url: "/user/profile", access: ["private"], parent: "user", title: "My Profile", template: "UserProfile" },

	{ name: "logout", url: "/logout", access: ["private"], action: function() { Meteor.logout(); }},

	{ name: "not_found", url:"*", layout: "MasterLayout", template: "NotFound" }
];
