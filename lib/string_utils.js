import moment from "moment";

const formatDate = function(date, dateFormat) {
	if(!date) {
		return "";
	}

	var f = dateFormat || "MM/DD/YYYY";

	if(typeof(date) == "string") {
		if(date.toUpperCase() == "NOW") {
			date = new Date();
		}
		if(date.toUpperCase() == "TODAY") {
			var d = new Date();
			date = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
		}
	}

	return moment(date).format(f);
};

const formatCurrency = function(value) {
	if(typeof(value) != "number") {
		value = parseFloat(value || 0);
	}

	return value.toFixed(2);
};


this.stringUtils = {
	formatDate: formatDate,
	formatCurrency: formatCurrency
};
