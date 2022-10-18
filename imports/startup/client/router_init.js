import { FlowRouter } from "meteor/ostrio:flow-router-extra";

import { routeMap } from "./routes.js";

import * as routerUtils from "./router_utils.js";

// Wait user data to load

FlowRouter.wait();

Tracker.autorun(function() {
	if(Roles.subscription.ready() && !FlowRouter._initialized) {
	     FlowRouter.initialize();
	}
});


// Register routes

routerUtils.registerRoutes(routeMap);


// If page became restricted after login/logout then redirect to first granted route

Tracker.autorun(function() {
	if(!Roles.subscription.ready() || !FlowRouter._initialized) {
		return
	}

	let user = Meteor.user();
	let currentContext = FlowRouter.current();
	let route = currentContext.route;
	if(route) {
		if(!routerUtils.routeGranted(route.name)) {
			FlowRouter.go(routerUtils.firstGrantedRoute());
		}
	}
});


// Register template helpers

Template.registerHelper("routeURL", routerUtils.routeURL);
Template.registerHelper("routeTitle", routerUtils.routeTitle);
Template.registerHelper("currentRouteTitle", routerUtils.currentRouteTitle);
Template.registerHelper("routeDefaultActionTitle", routerUtils.routeDefaultActionTitle);
Template.registerHelper("routeCancelActionTitle", routerUtils.routeCancelActionTitle);
Template.registerHelper("routeDefaultActionURL", routerUtils.routeDefaultActionURL);
Template.registerHelper("routeCancelActionURL", routerUtils.routeCancelActionURL);
Template.registerHelper("navItemVisible", routerUtils.navItemVisible);
Template.registerHelper("routeDefaultActionVisible", routerUtils.routeDefaultActionVisible);
Template.registerHelper("routeCancelActionVisible", routerUtils.routeCancelActionVisible);
Template.registerHelper("menuItemClass", routerUtils.menuItemClass);
Template.registerHelper("navItemClass", routerUtils.navItemClass);
Template.registerHelper("currentUserEmail", routerUtils.currentUserEmail);
Template.registerHelper("currentUserEmailOrUsername", routerUtils.currentUserEmailOrUsername);
Template.registerHelper("currentUserRoles", routerUtils.currentUserRoles);
