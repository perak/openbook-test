import { Meteor } from "meteor/meteor";
import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import { Roles } from "meteor/alanning:roles";

import { routeMap } from "./routes.js";


// Checks if route is accessible for user

export const routeGranted = function(routeName) {
	let routes = routeMap.filter(route => {
		return route.name === routeName;
	});

	if(!routes || !routes.length) {
		return false;
	}

	let route = routes[0];

	if(!route.access || (route.access.indexOf("public") >= 0 && route.access.indexOf("private") >= 0)) {
		return true;
	}

	if(route.access.indexOf("public") >= 0) {
		return !Meteor.user();
	}

	if(route.access.indexOf("private") >= 0) {
		if(!Meteor.user()) {
			return false;
		}

		if(!route.roles || !route.roles.length) {
			return true;
		}

		return Roles.userIsInRole(Meteor.userId(), route.roles);
	}

	return false;
};


// Returns first route from routeMap which is accessible for user

export const firstGrantedRoute = function(prefferedRoute) {
	if(prefferedRoute) {
		let grantedRoute = routeMap.find(route => {
			return route.url != "*" && route.name == prefferedRoute && routeGranted(route.name);
		});

		if(grantedRoute) {
			return grantedRoute.name;
		}
	}

	let grantedRoute = routeMap.find(route => {
		return route.url != "*" && routeGranted(route.name);
	});

	if(!grantedRoute) {
		throw new Meteor.Error("No granted routes.");
	}

	return grantedRoute.name;
};

export const parentRoutes = function(routeName, parents = []) {
	if(!routeName) {
		return parents;
	}

	let route = routeMap.find(r => r.name == routeName);
	if(!route) {
		return parents;
	}

	if(route.parent) {
		parents.unshift(route.parent);
	}

	return parentRoutes(route.parent, parents);
};


// Free routes group: accessible both for anonymous and authenticated users

export const freeRoutes = FlowRouter.group({
	name: "free",
	triggersEnter: [
		function(context, redirect, stop) {
		}
	]
});


// Public routes group: accessible only for anonymous users (e.g.: login, register...)

export const publicRoutes = FlowRouter.group({
	name: "public",
	triggersEnter: [
		function(context, redirect, stop) {
			if(!routeGranted(context.route.name)) {
				var redirectRoute = firstGrantedRoute("");
				redirect(redirectRoute);
			}
		}
	]
});


// Private routes group: accessible only for authenticated users

export const privateRoutes = FlowRouter.group({
	name: "private",
	triggersEnter: [
		function(context, redirect, stop) {
			if(!routeGranted(context.route.name)) {
				var redirectRoute = firstGrantedRoute("");
				redirect(redirectRoute);
			}
		}
	]
});


// Register routes
export const registerRoutes = function(routeMap) {
	routeMap.map(function(route) {

		// Special handling for route 404 NotFound
		if(route.url == "*") {
			FlowRouter.route(route.url, {
				name: route.name,
				action: function() {
					this.render(route.layout, { Content: route.template });
				}
			});
			return;
		}

		// Choose route group
		let routeGroup = null;
		if(!route.access || (route.access.indexOf("public") >= 0 && route.access.indexOf("private") >= 0)) {
			routeGroup = freeRoutes;		
		} else {
			if(route.access.indexOf("public") >= 0) {
				routeGroup = publicRoutes;
			} else {
				if(route.access.indexOf("private") >= 0) {
					routeGroup = privateRoutes;
				}
			}
		}

		if(!routeGroup) {
			throw new Meteor.Error("Unknown route group for route \"" + route.name + "\".");
		}

		
		let action = route.action;

		if(!action) {
			// No user defined action - using default action

			// Check if route is parent
			let firstChildRoute = routeMap.find(r => r.parent && r.parent == route.name);
			if(firstChildRoute) {
				// Route is parent - redirect to first child route
				action = function() {
					FlowRouter.redirect(firstChildRoute.url);
				};
			} else {
				// Route is not parent - check if route is child
				if(route.parent) {
					// Route is child - make list of all paent routes
					let parentRoutes = [];
					let parentRouteName = route.parent;
					do {
						if(parentRouteName) {
							let parentRoute = routeMap.find(r => r.name == parentRouteName);
							if(parentRoute) {
								parentRoutes.unshift(parentRoute);
								parentRouteName = parentRoute.parent;
							} else {
								parentRouteName = "";
							}
						}
					} while(parentRouteName);

					// Add this route to end of the list
					parentRoutes.push(route);

					// Render all parents and this route
					let layout = "";
					let renderDest = {};
					parentRoutes.map(function(parentRoute, routeIndex) {
						if(routeIndex == 0) {
							layout = parentRoute.layout;
							renderDest["Content"] = parentRoute.template;
						} else {
							renderDest[parentRoutes[routeIndex - 1].template + "Subcontent"] = parentRoute.template;
						}
					});

					action = function() {
						this.render(layout, renderDest);
					};
				} else {
					// Route is not child - normal rendering
					action = function() {
						this.render(route.layout, { Content: route.template });
					};
				}
			}
		}

		// Register route
		routeGroup.route(route.url, {
			name: route.name,
			action: action
		});
	});
};



// UI helpers

export const currentRouteDef = function() {
	let currentContext = FlowRouter.current();
	let route = currentContext.route;
	if(!route) {
		return null;
	}

	return routeMap.find(r => r.name == route.name);
};


export const routeDefaultRouteDef = function() {
	let routeDef = currentRouteDef();
	if(!routeDef) {
		return null;
	}

	return routeDef.defaultAction ? routeMap.find(r => r.name == routeDef.defaultAction) : null;
};

export const routeCancelRouteDef = function() {
	let routeDef = currentRouteDef();
	if(!routeDef) {
		return null;
	}

	return routeDef.cancelAction ? routeMap.find(r => r.name == routeDef.cancelAction) : null;
};

export const routeDefaultRouteName = function() {
	let defaultRouteDef = routeDefaultRouteDef();
	return defaultRouteDef ? defaultRouteDef.name || "" : "";
};

export const routeCancelRouteName = function() {
	let cancelRouteDef = routeCancelRouteDef();
	return cancelRouteDef ? cancelRouteDef.name || "" : "";
};

export const routeTitle = function(routeName) {
	let routeDef = routeMap.find(r => r.name == routeName);

	if(!routeDef) {
		return "";
	}

	return routeDef.title || "";
};

export const currentRouteTitle = function() {
	let routeDef = currentRouteDef();

	if(!routeDef) {
		return "";
	}

	return routeDef.title || "";
};

export const routeURL = function(routeName) {
	let routeDef = routeMap.find(r => r.name == routeName);

	if(!routeDef) {
		return "";
	}

	return routeDef.url || "";
};


export const routeDefaultActionTitle = function() {
	let defaultRouteName = routeDefaultRouteName();
	return defaultRouteName ? routeTitle(defaultRouteName) : "";
};

export const routeCancelActionTitle = function() {
	let currentRoute = currentRouteDef();

	if(!currentRoute) {
		return "";
	}

	if(currentRoute.cancelTitle) {
		return currentRoute.cancelTitle;
	}

	if(!currentRoute.cancelAction) {
		return "";
	}

	return "";
};

export const routeDefaultActionURL = function() {
	let defaultRouteName = routeDefaultRouteName();
	return defaultRouteName ? routeURL(defaultRouteName) : "";
};

export const routeCancelActionURL = function() {
	let cancelRouteName = routeCancelRouteName();
	return cancelRouteName ? routeURL(cancelRouteName) : "";
};

export const navItemVisible = function(routeName) {
	if(!routeGranted(routeName)) {
		return "hidden";
	}
	return "";
};


export const routeDefaultActionVisible = function() {
	return navItemVisible(routeDefaultRouteName());
};

export const routeCancelActionVisible = function() {
	return navItemVisible(routeCancelRouteName());
};

export const menuItemClass = function(routeName) {
	if(!routeGranted(routeName)) {
		return "d-none";
	}

	let currentContext = FlowRouter.current();
	let route = currentContext.route;
	if(!route) {
		return "";
	}

	if(route.name == routeName) {
		return "active";
	}

	// If child route is current, this route renders as active
	let parents = parentRoutes(route.name);
	if(parents.indexOf(routeName) >= 0) {
		return "active";
	}	

	return "";
};

export const navItemClass = function(routeName) {
	if(!routeGranted(routeName)) {
		return "d-none";
	}

	let currentContext = FlowRouter.current();
	let route = currentContext.route;
	if(!route) {
		return "";
	}

	if(route.name == routeName) {
		return "menuitem-active";
	}

	// If child route is current, this route renders as active
	let parents = parentRoutes(route.name);
	if(parents.indexOf(routeName) >= 0) {
		return "menuitem-active";
	}	

	return "";
};

export const currentUserEmail = function() {
	const user = Meteor.user();

	if(!user || !user.emails || !user.emails.length) {
		return "";
	}

	let email = user.emails.find(email => !!email.verified);

	return email ? email.address : (user.emails && user.emails.length ? user.emails[0].address || "" : "");
};


export const currentUserEmailOrUsername = function() {
	let res = currentUserEmail();
	if(res) {
		return res;
	}

	const user = Meteor.user();

	if(!user || !user.username) {
		return "";
	}

	return user.username;
};


export const currentUserRoles = function() {
	if(!Meteor.userId()) {
		return 
	}

	return Roles.getRolesForUser(Meteor.userId());
};
