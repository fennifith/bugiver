module.exports.titleize = function(string) {
	return string.split("_").join(" ")
		.split("-").join(" ")
		.replace(/([a-z])([A-Z])/g, "$1 $2")
		.replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");
};
