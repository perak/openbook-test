import "./login.html";

import { ReactiveDict } from 'meteor/reactive-dict'

Template.Login.onCreated(function () {
    this.state = new ReactiveDict();

    this.state.set("errorMessage", "");
});

Template.Login.events({
	"submit form": function(e, t) {
		e.preventDefault();

		var form = e.currentTarget;
		var data = formUtils.getFormData(form);

		Meteor.loginWithPassword(data.email, data.password, function(e, r) {
			if(e) {
				t.state.set("errorMessage", e.message);
				return;
			}
		});
	}
});

Template.Login.helpers({
	"errorMessage": function() {
		const inst = Template.instance();
		return inst.state.get("errorMessage");
	}
});
