import { BookTest } from "/imports/api/collections/book_test/collection.js";
import { ChatHistory } from "/imports/api/collections/chat_history/collection.js";

Meteor.methods({
	"bookTestInsert": function(data) {
		return BookTest.insert(data);
	},

	"bookTestUpdate": function(id, data) {
		return BookTest.update( { _id: id }, { $set: data });
	},

	"bookTestRemove": function(id) {
		return BookTest.remove({ _id: id });
	},

	"bookTestUpsert": function(selector, data) {
		return BookTest.upsert( selector, { $set: data });
	},

	async performTest(artifactId) {
		// If artifact ID is not provided, use latest artifact
		if(!artifactId) {
			artifactId = Meteor.call("latestArtifactId");
		}

		// Clear user's test collection
		BookTest.remove({ createdBy: this.userId });

		//
		// Prepare data for test: extract distinct questions to graded answers
		//
		const distinctQuestions = await ChatHistory.rawCollection().distinct("text", { type: "query", graded: true, createdBy: this.userId });

		distinctQuestions.map(function(questionText) {
			Meteor.call("bookTestInsert", { status: "waiting", query: questionText, answer: "", grade: "" });
		});


		// For each graded question, get new answer from bot and grade it
		BookTest.find().forEach(function(testItem) {
			const questionText = testItem.query;

			let newAnswer = null;
			try {
				newAnswer = Meteor.call("sendMessage", questionText, artifactId);
			} catch(e) {
				console.log(e);				
			}

			if(!newAnswer || newAnswer.status == "error") {
				Meteor.call("bookTestUpdate", testItem._id, { status: "error" });
				return;
			}

			let newAnswerText = newAnswer.result.answer;

			// OK, now we have new answer from bot,
			// let's check if that answer was marked as "correct" or "wrong"
			const sameQuestions = ChatHistory.find({ text: questionText, createdBy: this.userId, graded: true });
			let sameAnswerFound = false;
			sameQuestions.forEach(function(sameQuestion) {
				const answer = ChatHistory.findOne({ queryId: sameQuestion._id });
				if(answer && answer.text == newAnswerText) {
					Meteor.call("bookTestUpdate", testItem._id, { status: "done", answer: newAnswerText, grade: answer.grade });
					sameAnswerFound = true;
				}
			});

			if(!sameAnswerFound) {
				Meteor.call("bookTestUpdate", testItem._id, { status: "done", answer: newAnswerText });
			}
		});
	}
});
