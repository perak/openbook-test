const accessPropertyViaDotNotation = function(propertyName, obj) {
	var props = propertyName.split(".");
	var res = obj;
	for(var i = 0; i < props.length; i++) {
		res = res[props[i]];
		if(typeof res == "undefined") {
			return res;
		}
	}
	return res;
};


this.accessPropertyViaDotNotation = accessPropertyViaDotNotation;
