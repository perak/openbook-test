import "./reset_password.html";

import { ReactiveDict } from 'meteor/reactive-dict'

Template.ResetPassword.onCreated(function () {
    this.state = new ReactiveDict();

    this.state.set("errorMessage", "");
    this.state.set("emailSent", false);
});

Template.ResetPassword.events({
	"submit form": function(e, t) {
		e.preventDefault();

		var form = e.currentTarget;
		var data = formUtils.getFormData(form);

		Meteor.call("sendResetPasswordEmail", data.email, function(e, r) {
			if(e) {
				t.state.set("errorMessage", e.message);
				return;
			}
    		t.state.set("emailSent", true);
		});
	}
});

Template.ResetPassword.helpers({
	"emailNotSent": function() {
		const inst = Template.instance();
		return !inst.state.get("emailSent");
	},

	"errorMessage": function() {
		const inst = Template.instance();
		return inst.state.get("errorMessage");
	}
});
