import { BookTest } from "/imports/api/collections/book_test/collection.js";

import "./test.html";


import { ReactiveDict } from 'meteor/reactive-dict'
const moment = require("moment");


Template.Test.onCreated(function() {
    let self = this;

    this.state = new ReactiveDict();

    this.state.set("dataReady", false);
    this.state.set("errorMessage", "");

    Tracker.autorun(() => {
		let isReady = true;


        const subscriptionHandles = [
        	Meteor.subscribe("book_test")
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


Template.Test.onRendered(function() {

});


Template.Test.helpers({
    "dataReady": function() {
		const t = Template.instance();
		return t.state.get("dataReady");
	},

	"testData": function() {
		return BookTest.find({ createdBy: Meteor.userId() }, { sort: { createdAt: 1} });
	},

	"statusIconClass": function() {
		let iconClass = "";
		switch(this.grade) {
			case "correct": iconClass = "text-success"; break;
			case "wrong": iconClass = "text-danger"; break;
		}
		return iconClass;
	},

	"waitingTest": function() {
		return !!BookTest.findOne({ status: "waiting" });
	}
});


Template.Test.events({
	"click .perform-test": function(e, t) {
		Meteor.call("performTest");
	}

});

