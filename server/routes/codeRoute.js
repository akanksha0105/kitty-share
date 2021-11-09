const express = require("express");
const router = express.Router();
const CodeModel = require("../models/codeModel");
const Keys = require("../models/keysModel");
const generateCodes = require("../generateCodes");
var mongoose = require("mongoose");
const ObjectId = require("mongo-objectid");

//Router for retrieving the URL - need to give the code to get the url
router.get("/geturl/:codedMessage", (req, res) => {
	const code = req.params.codedMessage;
	console.log(
		`In codeRoute router for retrieving the URL by passing the code ${code}`,
	);

	let codeGeneratedPromise = CodeModel.find({ code: code }).exec();

	codeGeneratedPromise
		.then((response) => {
			console.log(
				"Response for retrieving the URL from the code in router",
				response,
			);
			if (response.length <= 0) {
				return res.status(404).json({ code: 102, data: "Code not found" });
			}

			res.status(200).json({
				data: response[0].message,
				device: response[0].deviceId,
			});
		})
		.catch((err) => {
			console.error(
				"Server was unable to fetch the URL for the given code",
				err.message,
			);
			res.status(500).send({
				code: 101,
				data: "Server was unable to fetch the URL for the given code",
			});
		});
});

const checkOrGenerateCode = async (url, currentDeviceId) => {
	let codeQueryPromise = CodeModel.find({ message: url }).exec();

	return codeQueryPromise.then((queryResults) => {
		if (queryResults.length > 0) {
			return queryResults[0].code;
		}

		// const id = new ObjectId().toString();

		return generateCodes
			.getUnusedCode()
			.then((generateIdPromiseResponse) => {
				console.log("generateIdPromiseResponse", generateIdPromiseResponse);

				// if(generateIdPromiseResponse.combinationGenerated === true)

				const newCodePair = new CodeModel({
					deviceId: currentDeviceId,
					code: generateIdPromiseResponse.code,
					message: url,
					createdAt: new Date(),
				});
				return newCodePair.save();
			})
			.then((newCodePairSavedResponse) => {
				console.log("new codePair saved", newCodePairSavedResponse);
				return newCodePairSavedResponse.code;
			})
			.catch((err) => {
				console.error("Error in checking and generating code in route", err);
			});
	});
};

//Router for generating code
router.post("/postthevalue", (req, res) => {
	const url = req.body.valueOfTheURL;
	const currentDeviceId = req.body.senderDeviceId;

	console.log(
		`In codeRoute router for generating the code for the given URL by providing currentDeviceId ${currentDeviceId} and url ${url}`,
	);

	const codePromise = checkOrGenerateCode(url, currentDeviceId);

	codePromise
		.then((code) => {
			console.log(
				"Response for generating the secret key for the entered URL",
				code,
			);

			res.status(200).json({ data: code });
			// return code;
		})
		// .then((generatedCodeResponse) => {
		// 	//return Keys.updateOne(codeOldStatus, { $set: codeNewStatus });
		// 	//return Keys.find({ code: x });
		// 	return Keys.updateOne(
		// 		{ code: generatedCodeResponse },
		// 		{ $set: { status: "used" } },
		// 	);
		// })
		// .then((updatedResponse) => {
		// 	console.log("updatedResponse", updatedResponse);
		// })
		.catch((err) => {
			console.error(
				"Server was not able to generate the secret code for the URL",
				err.message,
			);
			res.status(500).send({
				code: 201,
				message: "Server was not able to generate the secret code for the URL",
			});
		});
});

module.exports = router;

// const checkOrGenerateCode = async (url, currentDeviceId) => {
// 	let codeQueryPromise = CodeModel.find({ message: url }).exec();

// 	return codeQueryPromise.then((queryResults) => {
// 		if (queryResults.length > 0) {
// 			return queryResults[0].code;
// 		}

// 		const id = new ObjectId().toString();

// 		const code = id;
// 		const newCodePair = new CodeModel({
// 			deviceId: currentDeviceId,
// 			code: code,
// 			message: url,
// 			createdAt: new Date(),
// 		});
// 		return newCodePair.save().then((record) => {
// 			console.log("record is", record);
// 			return record.code;
// 		});
// 	});
// };
