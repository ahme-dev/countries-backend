import { Router } from "express";
import { usersDB } from "../db.js";

// create router
const usersRouter = Router();

// routes

usersRouter.route("/").get((req, res) => {
	let usersClone = JSON.parse(JSON.stringify(usersDB.data));

	// remove hash and salt from user data
	usersClone.map((el) => {
		delete el.salt;
		delete el.hash;
		return el;
	});

	return res.json(usersClone);
});

usersRouter.route("/me").get((req, res) => {
	console.log("user: start request session is", req.session, req.sessionID);

	if (!req.session.username) return res.sendStatus(401);

	console.log("user: will try to fetch data from db", usersDB.data);

	// find user
	let user = usersDB.data.find((el) => el.username === req.session.username);

	console.log("user: found this", user);

	// return if user not found
	if (!user) return res.sendStatus(404);

	// make clone without password
	let userWithoutPass = JSON.parse(JSON.stringify(user));
	delete userWithoutPass.password;

	console.log("user: done and data returned");

	return res.json(userWithoutPass);
});

usersRouter.route("/me/:type").patch(async (req, res) => {
	if (!req.session.username)
		return res.status(401).json({ message: "Not logged in." });

	let answerType = req.params.type;

	// return if not on either route
	if (answerType !== "flags" && answerType !== "capitals") {
		return res.sendStatus(404);
	}

	// return if answer not provided
	if (!req.body.answer)
		return res.send(400).json({ message: "Provide an answer object." });

	// find user index
	let userID = usersDB.data.findIndex(
		(el) => el.username === req.session.username,
	);

	// push answer to users results based on type
	usersDB.data[userID][answerType].answers.push(req.body.answer);
	usersDB.data[userID][answerType].index += 1;

	// increase user index
	await usersDB.write();

	res.status(202).json({ message: "Answer was added." });
});

export { usersRouter };
