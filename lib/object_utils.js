
// Check if object is empty

const isEmpty = function(obj) {
	return Object.keys(obj).length === 0;
};


// Merges two (or more) objects, giving the last one precedence

const mergeObjects = function(target, source) {

	if(typeof target !== "object") {
		target = {};
	}

	for(let property in source) {

		if(source.hasOwnProperty(property)) {

			let sourceProperty = source[ property ];

			if(typeof sourceProperty === 'object') {
				target[property] = mergeObjects(target[property], sourceProperty);
				continue;
			}

			target[property] = sourceProperty;
		}
	}

	for(let a = 2, l = arguments.length; a < l; a++) {
		mergeObjects(target, arguments[a]);
	}

	return target;
};


this.objectUtils = {
	isEmpty: isEmpty,
	mergeObjects: mergeObjects
};
