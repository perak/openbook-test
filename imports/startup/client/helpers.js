Template.registerHelper("formatDate", stringUtils.formatDate);

Template.registerHelper("optionIsSelected", function(val1, val2) {
	return ("" + val1) == ("" + val2) ? "selected" : "";
});

Template.registerHelper("itemIsActive", function(val1, val2) {
	return ("" + val1) == ("" + val2) ? "active" : "";
});

Template.registerHelper("formatCurrency", function(value) {
	return stringUtils.formatCurrency(value);
});

Template.registerHelper("equal", function(a, b) {
	return a == b;
});
