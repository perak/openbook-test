import "./profile.html";


import { FlowRouter } from "meteor/ostrio:flow-router-extra";
import { ReactiveDict } from 'meteor/reactive-dict'

Template.UserProfile.onCreated(function () {
	const self = this;

    this.state = new ReactiveDict();

    this.state.set("errorMessage", "");
	this.state.set("successMessage", "");
	this.state.set("submitting", false);
	this.state.set("dataReady", false);

	const subscriptionHandles = [
	];

	Tracker.autorun(() => {

		let isReady = true;
		subscriptionHandles.map(function(handle) {
			if(!handle.ready()) {
				isReady = false;
			}
		});

		self.state.set("dataReady", isReady);

		if(isReady) {

		}
	});
});


Template.UserProfile.events({
	"submit #change-password-form": function(e, t) {
		e.preventDefault();
		let form = e.currentTarget;
		let data = formUtils.getFormData(form);

		t.state.set("errorMessage", "");
		t.state.set("successMessage", "");
		t.state.set("submitting", true);

		if(data.newPassword != data.newPasswordRepeat) {
			t.state.set("submitting", false);
			t.state.set("successMessage", "");
			t.state.set("errorMessage", "New password and repeat don't match.");
			return;
		}

		Accounts.changePassword(data.oldPassword, data.newPassword, function(e, r) {
			if(e) {
				t.state.set("submitting", false);
				t.state.set("successMessage", "");
				t.state.set("errorMessage", e.message);
				return;
			}

			form.reset();
			t.state.set("errorMessage", "");
			t.state.set("successMessage", "The password is changed.");
			t.state.set("submitting", false);

			Meteor.setTimeout(function() {
				t.state.set("successMessage", "");
			}, 2000);

		});
	}
});

Template.UserProfile.helpers({
	"dataReady": function() {
		const t = Template.instance();
		return t.state.get("dataReady");
	},

	"errorMessage": function() {
		const inst = Template.instance();
		return inst.state.get("errorMessage");
	},

	"successMessage": function() {
		const inst = Template.instance();
		return inst.state.get("successMessage");
	},

	"user": function() {
		return Meteor.user();
	}
});
