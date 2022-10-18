
const getFormData = function(formElement) {
	var formData = new FormData(formElement);

	var data = {};
	for(var [key, value] of formData.entries()) { 
		data[key] = value;
	}

	return data;
};


this.formUtils = {
	getFormData: getFormData
};
