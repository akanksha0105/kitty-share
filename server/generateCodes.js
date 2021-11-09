const { response } = require("express");
const mongoose = require("mongoose");
const Codes = require("./models/codeModel");

const Keys = require("./models/keysModel");

let output = "";
const generateCode = async (arr, n, tuple, k) => {
	//let arrayIndex = 0;
	return generateCombination(k, arr, n, tuple).then(
		(generateCombinationResponse) => {
			console.log("generateCombination", generateCombinationResponse);
			console.log("output in the final call : ", output);
			return output;
		},
	);
};

const generateCombination = async (k, arr, n, tuple) => {
	// console.log(`k is ${k} , arr is ${arr}, n is ${n} and tuple is ${tuple}`);

	if (k === 0) {
		console.log("Loop 1");
		console.log(`tuple now : ${tuple}`);

		let tempResult = tuple.join("");
		console.log(`tempResult is: ${tempResult}`);
		const ans = await checkIfCodeIsPresent(tempResult);
		console.log("ans is : ", ans);
		if (ans === true) {
			output = "";
			return;
		}
		if (ans === false) {
			output = tempResult;
			console.log(`output : ${output}`);
			return;
		}
	} else {
		console.log("Loop 2");
		for (let i = 0; i < n; i++) {
			tuple.push(arr[i]);
			await generateCombination(k - 1, arr, n, tuple);
			console.log(`outputResult in loop 1: ${output}`);
			if (output) {
				console.log(`Meets the condition of existence of output : ${output}`);
				return;
			}
			tuple.pop();
		}
	}
};

const checkIfCodeIsPresent = async (outputResult) => {
	return Codes.find({ code: outputResult })
		.then((checkIfCodeIsPresentResponse) => {
			console.log(
				"checkIfCodeIsPresentResponse",
				checkIfCodeIsPresentResponse.length,
			);
			if (checkIfCodeIsPresentResponse.length > 0) {
				return true;
			}

			return false;
		})
		.catch((err) => {
			console.error("Error in checkIfCodeIsPresentResponse function", err);
		});
};

const getUnusedCode = async () => {
	// let arr = [1, 2, 3];
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
	let n = arr.length;
	let tuple = [];
	let k = 6;

	return generateCode(arr, n, tuple, k)
		.then((generateCodePromiseResponse) => {
			console.log(
				"generateCodePromiseResponse : ",
				generateCodePromiseResponse,
			);

			return { combinationGenerated: true, code: generateCodePromiseResponse };
		})
		.catch((err) => {
			console.error("Error in gettingUnusedCode Function", err);
			return { combinationGenerated: false, code: null };
		});
};

module.exports = { getUnusedCode, generateCode };
