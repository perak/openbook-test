import { ChatHistory } from "/imports/api/collections/chat_history/collection.js";

import "./chat.html";


import { ReactiveDict } from 'meteor/reactive-dict'
const moment = require("moment");


const scrollToBottom = function(selector) {
	Meteor.setTimeout(function() {
		$(selector).animate({ scrollTop: $(selector).prop("scrollHeight")}, 100);
	}, 50);
};

Template.Chat.onCreated(function() {
    let self = this;

    this.state = new ReactiveDict();

    this.state.set("dataReady", false);
    this.state.set("errorMessage", "");

    Tracker.autorun(() => {
		let isReady = true;


        const subscriptionHandles = [
        	Meteor.subscribe("chat_history")
        ];

		subscriptionHandles.map(function(subscriptionHandle) {
			if(!subscriptionHandle.ready()) {
				isReady = false;
			}
		});

		self.state.set("dataReady", isReady);

		if(isReady) {

		}
	});

});


Template.Chat.onRendered(function() {
	scrollToBottom(".conversation-list");
});


Template.Chat.helpers({
    "dataReady": function() {
		const t = Template.instance();
		return t.state.get("dataReady");
	},

	"chatHistory": function() {
		return ChatHistory.find({ createdBy: Meteor.userId() }, { sort: { createdAt: 1} });
	},

	"buttonColor": function(buttonType) {
		switch(buttonType) {
			case "correct": {
				return this.grade && this.grade == "correct" ? "btn-outline-success" : "";
			}; break;
			case "wrong": {
				return this.grade && this.grade == "wrong" ? "btn-outline-danger" : "";
			}; break;
		}
		return "";
	}
});


Template.Chat.events({
	"submit .chat-form": function(e, t) {
		e.preventDefault();

		const form = e.currentTarget;
		const input = $(form).parent().find("input[name='message']");

		const data = formUtils.getFormData(form);

		input.val("");


		const text = data.message;

		Meteor.call("chatHistoryInsert", { type: "query", text: text, queryId: null }, function(e, res) {
			scrollToBottom(".conversation-list");

			Meteor.call("sendMessage", text, function(e, r) {
				if(e) {
					Meteor.call("chatHistoryInsert", { type: "error", text: e.message, queryId: res });
					scrollToBottom(".conversation-list");
					return;
				}

				if(!r.status || r.status == "error") {
					Meteor.call("chatHistoryInsert", { type: "error", text: r.status.error.message, queryId: res });
					scrollToBottom(".conversation-list");
					return;
				}

				Meteor.call("chatHistoryInsert", { type: "answer", text: r.result.answer, queryId: res });
				scrollToBottom(".conversation-list");
			});
		});
	},

	"click .grade-button": function(e, t) {
		const button = $(e.currentTarget);
		let grade = button.attr("data-grade");

		if(this.grade && this.grade == grade) {
			// Clear grade
			grade = "";
		}

		// Set grade
		Meteor.call("chatHistoryGrade", this._id, grade);
	}

});
