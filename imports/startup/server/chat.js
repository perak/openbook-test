import { HTTP } from "meteor/http";

const OPENBOOK_API_BASE_URL = "https://api.openbook.botpress.cloud/v1/artifacts/";

const ARTIFACT_ID = "1d53dcbb9b317a3f.9d449cc50c01645d";

const API_KEY = "-E7abq6slf2EYZ-HpW4mOog5zYMCCmr2nrwUKvaMrCs.gj9_tFPrVlvB6QnWy6wp0DalZ5Rl-P1vDkG82uRXSZU";


Meteor.methods({
	"sendMessage": function(text) {

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

		let response = HTTP.post(OPENBOOK_API_BASE_URL + ARTIFACT_ID + "/query", options);

		return response.data;
	}
});
