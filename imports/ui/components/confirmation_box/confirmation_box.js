import { Random } from "meteor/random"

import "./confirmation_box.html";

export const confirmationBox = function(title, message, onApprove, onDeny, options) {
	var tmpl = Template["ConfirmationBox"];
	var wrapper = document.body.appendChild(document.createElement("div"));
	var boxId = Random.id();

	options = options || {};

	var data = {
		boxId: boxId,
		wrapper: wrapper,
		title: title,
		message: message,
		approveButtonTitle: options.approveButtonTitle || "Yes",
		denyButtonTitle: options.denyButtonTitle || "No",
		cancelButtonTitle: options.cancelButtonTitle || "Cancel",
		showCancelButton: options.showCancelButton || false,

		onApprove: function() {
			if(onApprove) {
				onApprove();
			}
			return true;
		},

		onDeny: function(isCancel) {
			if(onDeny) {
				onDeny(isCancel);
				return true; 
			}
		}
	};

	Blaze.renderWithData(tmpl, data, wrapper);
};

Template.ConfirmationBox.rendered = function() {
	var self = this;

	this.$(".modal").modal("show");

	this.$(".modal").on("hidden.bs.modal", function(e) {
		self.data.wrapper.remove();
	});
};

Template.ConfirmationBox.events({
	"click .button-approve": function(e, t) {
		t.$(".modal").modal("hide");

		Meteor.defer(function() {
			if(t.data.onApprove) {
				t.data.onApprove();
			}
		});
	},

	"click .button-deny": function(e, t) {
		t.$(".modal").modal("hide");

		Meteor.defer(function() {
			if(t.data.onDeny) {
				t.data.onDeny(false);
			}
		});
	},

	"click .button-cancel": function(e, t) {
		t.$(".modal").modal("hide");

		Meteor.defer(function() {
			if(t.data.onDeny) {
				t.data.onDeny(true);
			}
		});
	}
});
