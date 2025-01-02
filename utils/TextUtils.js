export const capitalizeFirstLetter = (string) => {
	if (!string) return "";
	return string.charAt(0).toUpperCase() + string.slice(1);
};

export const toLowerCase = (string) => {
	if (!string) return "";
	return string.toLowerCase();
};

export const toUpperCase = (string) => {
	if (!string) return "";
	return string.toUpperCase();
};

export const capitalizeEachWord = (string) => {
	if (!string) return "";
	return string
		.split(" ")
		.map((word) => capitalizeFirstLetter(word))
		.join(" ");
};
