const dbconnection = require("./db");

const generateCodeCombinations = () => {
	let outputArrayResult = printAllKLength();

	return outputArrayResult;
	// insert document to 'users' collection using insertOne
};

function printAllKLength() {
	//let arr = [1, 2, "a"];
	let arr = [
		"a",
		"b",
		"c",
		"d",
		"e",
		"f",
		"g",
		"h",
		"i",
		"j",
		"k",
		"l",
		"m",
		"n",
		"o",
		"p",
		"q",
		"r",
		"s",
		"t",
		"u",
		"v",
		"w",
		"x",
		"y",
		"z",
		"A",
		"B",
		"C",
		"D",
		"E",
		"F",
		"G",
		"H",
		"I",
		"J",
		"K",
		"L",
		"M",
		"N",
		"O",
		"P",
		"Q",
		"R",
		"S",
		"T",
		"U",
		"V",
		"W",
		"X",
		"Y",
		"Z",
		0,
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
	];

	let n = arr.length; //62
	let k = 6; //2
	let outputArray = [];
	printAllKLengthRec(arr, "", n, k, outputArray);
	return outputArray;
}

function printAllKLengthRec(arr, prefix, n, k, outputArray) {
	// Base case: k is 0,
	// print prefix
	if (k == 0) {
		// document.write(prefix + "<br>");
		// console.log("prefix", prefix);
		outputArray.push(prefix);
		return;
	}

	// One by one add all characters
	// from set and recursively
	// call for k equals to k-1
	for (let i = 0; i < n; ++i) {
		// Next character of input added
		let newPrefix = prefix + arr[i];

		// k is decreased, because
		// we have added a new character
		printAllKLengthRec(arr, newPrefix, n, k - 1, outputArray);
	}
}

module.exports = { generateCodeCombinations };
