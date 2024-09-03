const express = require("express");
const router = express.Router();
const TextCodeModel = require("../models/textCodeModel");
const RESPONSE_CODES = require("../constants/responseCodes");

// Route refactored and checked
router.get("/gettextnote/:newCode", (req, res) => {
	const code = req.params.newCode;
	let textGeneratedPromise = TextCodeModel.find({ code: code }).exec();

	textGeneratedPromise
		.then((textGeneratedPromiseResponse) => {
			if (textGeneratedPromiseResponse.length <= 0) {
				return res
					.status(404)
					.json({ code: RESPONSE_CODES.CODE_NOT_FOUND, data: "Code not found", messageRetrieved: false });
			}

			res.status(200).json({
				code: RESPONSE_CODES.SUCCESS,
				data: textGeneratedPromiseResponse[0].message,
				messageRetrieved: true,
			});
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send({
				code: RESPONSE_CODES.SERVER_ERROR,
				data: "Server was unable to fetch the URL for the given code",
				messageRetrieved: false,
			});
		});
});

module.exports = router;
