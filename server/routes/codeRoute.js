const express = require("express");
const router = express.Router();
const CodeModel = require("../models/codeModel");
var mongoose = require("mongoose");
const ObjectId = require("mongo-objectid");

//Router for retrieving the URL
router.post("/getcodegenerated", async (req, res) => {
	const code = req.body.codedMessage;
	console.log("code is", code);
	console.log("Server fetching the code...");
	let codeGeneratedPromise = CodeModel.find({ code: code }).exec();

	// console.log("codeGenerated Promise", codeGeneratedPromise);
	codeGeneratedPromise
		.then((response) => {
			console.log("response is: ", response);
			console.log("response length", response.length);
			if (response.length <= 0) {
				return res.status(404).json({ code: 102, message: "Code not found" });
			}

			res
				.status(200)
				.json({
					data: response[0].message,
					message: `Do you want to add ${response[0].deviceId} as a new connection ?`,
				});
		})
		.catch((err) => {
			console.log(err.message);
			res
				.status(500)
				.send({ code: 101, message: "Server was unable to fetch the URL" });
		});
});

const checkOrGenerateCode = async (url, currentDeviceId) => {
	let codeQueryPromise = CodeModel.find({ message: url }).exec();

	return codeQueryPromise.then((queryResults) => {
		if (queryResults.length > 0) {
			return queryResults[0].code;
		}

		const id = new ObjectId().toString();
		const code = id;
		const newCodePair = new CodeModel({
			deviceId: currentDeviceId,
			code: code,
			message: url,
			createdAt: new Date(),
		});
		return newCodePair.save().then((record) => {
			console.log("record is", record);
			return record.code;
		});
	});
};

router.post("/postthevalue", (req, res) => {
	const url = req.body.valueOfTheURL;
	const currentDeviceId = req.body.currentDeviceId;
	console.log("Server checks if the URL is already present in the database");

	const codePromise = checkOrGenerateCode(url, currentDeviceId);

	codePromise
		.then((code) => {
			console.log("URL saved by the server");
			console.log("Server generating the secret key for the entered URL...");

			res.status(200).json({ data: code });
		})
		.catch((err) => {
			console.log(err.message);
			res.status(500).send({
				code: 201,
				message: "Server was not able to generate the secret key",
			});
		});
});

module.exports = router;

// const { response } = require("express");

// router.post("/getcodegenerated", async (req, res) => {
//   const code = req.body.codedMessage;
//   CodeModel.find({ code: code }, (err, docs) => {
//     if (docs.length > 0) {
//       console.log(res);
//       return res.status(200).json({ data: docs[0].message });
//     } else {
//       return res.status(400).json({ message: "Something went wrong" });
//     }
//   });
// });
// router.post("/postthevalue", (req, res) => {
//   const message = req.body.valueOfTheURL;
//   CodeModel.find({ message: message }, (err, docs) => {
//     if (docs.length > 0) {
//       console.log("URL already exists");
//     } else {
//       const id = new ObjectId().toString();
//       const code = id;

//       const newCodePair = new CodeModel({
//         code: code,
//         message: message,
//       });

//       newCodePair.save((err) => {
//         if (!err) {
//           console.log("response of post request in node.js", code);
//           return res.status(200).json({ data: code });
//         } else {
//           return res.status(400).json({ message: "Something went wrong" });
//         }
//       });
//     }
//   });
// });
