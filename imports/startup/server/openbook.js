import { HTTP } from "meteor/http";

const OPENBOOK_API_BASE_URL = "https://api.openbook.botpress.cloud/v1";

const API_KEY = "-E7abq6slf2EYZ-HpW4mOog5zYMCCmr2nrwUKvaMrCs.gj9_tFPrVlvB6QnWy6wp0DalZ5Rl-P1vDkG82uRXSZU";


Meteor.methods({
	"sendMessage": function(text, artifactId) {

		// If artifact ID is not provided, use latest artifact
		if(!artifactId) {
			artifactId = Meteor.call("latestArtifactId");
		}

		let options = {
			headers: {
				"Authorization": "Bearer " + API_KEY,
			},
			data: {
				"query": text,
				"history": [
				],
				"answer_level": "strict"
			}
		};

		let response = HTTP.post(OPENBOOK_API_BASE_URL + "/artifacts/" + artifactId + "/query", options);

		return response.data;
	},


	"listArtifacts": function() {
		let options = {
			headers: {
				"Authorization": "Bearer " + API_KEY,
			}
		};

		const response = HTTP.get(OPENBOOK_API_BASE_URL + "/artifacts", options);

		return response.data;
	},

	"latestArtifactId": function() {
		const response = Meteor.call("listArtifacts");
		if(response.status == "success") {
			response.artifacts.sort((a, b) => (Date.parse(a.modifiedAt) > Date.parse(b.modifiedAt)) ? 1 : -1);

			let latestArtifact = response.artifacts[response.artifacts.length - 1];

			return latestArtifact.id;
		}
		return null;
	}


});
