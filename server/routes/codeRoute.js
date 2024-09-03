const express = require("express");
const router = express.Router();
const CodeModel = require("../models/codeModel");
const generateCodes = require("../generateCodes");
var mongoose = require("mongoose");
const RESPONSE_CODES = require("../constants/responseCodes");

//Router Refactored and Checked
//Router for retrieving the URL - need to give the code to get the url
router.get("/geturl/:codedMessage", (req, res) => {
	const code = req.params.codedMessage;
	let codeGeneratedPromise = CodeModel.find({ code: code }).exec();

	codeGeneratedPromise
		.then((response) => {
			if (response.length <= 0) {
				return res.status(404).json({ code: RESPONSE_CODES.RESOURCE_NOT_FOUND, data: "Code not found", device: "" });
			}

			res.status(200).json({
				code: RESPONSE_CODES.SUCCESS,
				data: response[0].message,
				device: response[0].deviceId,
			});
		})
		.catch((err) => {
			res.status(500).send({
				code: RESPONSE_CODES.SERVER_ERROR,
				data: "Server was unable to fetch the URL for the given code",
				device: "",
			});
		});
});

const checkOrGenerateCode = async (url, currentDeviceId) => {
	let codeQueryPromise = CodeModel.find({ message: url }).exec();

	return codeQueryPromise.then((queryResults) => {
		if (queryResults.length > 0) {
			return queryResults[0].code;
		}

		return generateCodes
			.getUnusedCode()
			.then((generateIdPromiseResponse) => {
				const newCodePair = new CodeModel({
					deviceId: currentDeviceId,
					code: generateIdPromiseResponse.code,
					message: url,
					createdAt: new Date(),
				});
				return newCodePair.save();
			})
			.then((newCodePairSavedResponse) => {
				return { data: newCodePairSavedResponse.code, code: RESPONSE_CODES.SUCCESS };
			})
			.catch((err) => {
				console.error("Error in checking and generating code in route", err);
				return {
					data: "", code: RESPONSE_CODES.SERVER_ERROR
				};
			});
	});
};

//Router refactored and checked
router.post("/postthevalue", (req, res) => {
	const url = req.body.valueOfTheURL;
	const currentDeviceId = req.body.senderDeviceId;

	console.log(
		`In codeRoute router for generating the code for the given URL by providing currentDeviceId ${currentDeviceId} and url ${url}`,
	);

	const codePromise = checkOrGenerateCode(url, currentDeviceId);

	codePromise
		.then((code) => {

			res.status(200).json({ data: code, code: RESPONSE_CODES.SUCCESS, message: "Successfully generated code" });
		})

		.catch((err) => {

			res.status(500).send({
				code: RESPONSE_CODES.SERVER_ERROR,
				message: "Server was not able to generate the secret code for the URL",
				data: "",
			});
		});
});

module.exports = router;

