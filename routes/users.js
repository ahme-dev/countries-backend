import { Router } from "express";
import { usersDB } from "../db.js";
import { requireAuth } from "../middleware/requireAuth.js";

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

usersRouter.route("/me").get(requireAuth, (req, res) => {
	// find user
	let user = usersDB.data.find((el) => el.username === req.session.username);

	// make user clone
	let userClone = JSON.parse(JSON.stringify(user));

	// remove salt and hash
	delete userClone.salt;
	delete userClone.hash;

	return res.json(userClone);
});

usersRouter.route("/me/:type").patch(requireAuth, async (req, res) => {
	let answerType = req.params.type;

	// if not on either route return
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
