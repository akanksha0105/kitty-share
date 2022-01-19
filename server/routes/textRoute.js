const express = require("express");
const router = express.Router();
const TextCodeModel = require("../models/textCodeModel");

router.get("/gettextnote/:newCode", (req, res) => {
	console.log("In /gettextnote/:newCode", req.params);
	const code = req.params.newCode;

	console.log("Code against text", code);

	let textGeneratedPromise = TextCodeModel.find({ code: code }).exec();

	textGeneratedPromise
		.then((textGeneratedPromiseResponse) => {
			console.log("textGeneratedPromiseResponse", textGeneratedPromiseResponse);

			if (textGeneratedPromiseResponse.length <= 0) {
				return res
					.status(404)
					.json({ code: 102, data: "Code not found", messageRetrieved: false });
			}

			res.status(200).json({
				data: textGeneratedPromiseResponse[0].message,
				messageRetrieved: true,
			});
		})
		.catch((err) => {
			console.error(err);
			res.status(500).send({
				code: 101,
				data: "Server was unable to fetch the URL for the given code",
				messageRetrieved: false,
			});
		});
});

module.exports = router;
