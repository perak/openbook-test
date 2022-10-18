import { ChatHistory } from "/imports/api/collections/chat_history/collection.js";

Meteor.methods({
	"chatHistoryInsert": function(data) {
		return ChatHistory.insert(data);
	},

	"chatHistoryUpdate": function(id, data) {
		return ChatHistory.update( { _id: id }, { $set: data });
	},

	"chatHistoryRemove": function(id) {
		return ChatHistory.remove({ _id: id });
	},

	"chatHistoryUpsert": function(selector, data) {
		return ChatHistory.upsert( selector, { $set: data });
	},

	"chatHistoryGrade": function(id, grade) {
		// Read requested answer
		const answer = ChatHistory.findOne({ _id: id });
		if(!answer) {
			return;
		}

		// Grade requested answer
		ChatHistory.update( { _id: answer._id }, { $set: { grade: grade } });

		// Mark question as graded/non-graded
		ChatHistory.update( { _id: answer.queryId }, { $set: { graded: !!grade }});

		//
		// Now grade same answers to same question
		//

		// Read this answer's question
		const query = ChatHistory.findOne({ _id: answer.queryId });
		if(!query) {
			console.log("Query for this answer is not found in the database (somehow!?).");
			return;
		}

		// Select same questions
		const sameQuestions = ChatHistory.find({ type: "query", createdBy: this.userId, text: query.text });
		sameQuestions.forEach(function(sameQuestion) {
			// Grade answer if it is the same as our graded answer
			const sameAnswer = ChatHistory.findOne({ queryId: sameQuestion._id, text: answer.text });
			if(sameAnswer) {
				ChatHistory.update({ _id: sameAnswer._id  }, { $set: { grade: grade } });
				ChatHistory.update({ _id: sameQuestion._id  }, { $set: { graded: !!grade } });
			}
		});
	}
});
