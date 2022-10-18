import { FlowRouter } from "meteor/ostrio:flow-router-extra";

import "./create_password.html";

import { ReactiveDict } from 'meteor/reactive-dict'

Template.CreatePassword.onCreated(function () {
    this.state = new ReactiveDict();

    this.state.set("errorMessage", "");
});

Template.CreatePassword.events({
	"submit form": function(e, t) {
		e.preventDefault();

		var token = FlowRouter.getParam("token");
		var form = e.currentTarget;
		var data = formUtils.getFormData(form);

		Accounts.resetPassword(token, data.password, function(e, r) {
			if(e) {
				t.state.set("errorMessage", e.message);
				return;
			}
		});
	}
});

Template.CreatePassword.helpers({
	"errorMessage": function() {
		const inst = Template.instance();
		return inst.state.get("errorMessage");
	}
});
