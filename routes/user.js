import { Router } from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

// config and read lowdb
const usersDB = new Low(new JSONFile("data/users.json"));
await usersDB.read();

// create router
const userRouter = Router();

// routes

userRouter.route("/").get((req, res) => {
	if (!req.session.auth.username) return res.sendStatus(401);

	// find user
	let user = usersDB.data.find(
		(el) => el.username === req.session.auth.username,
	);

	// return if user not found
	if (!user) return res.sendStatus(404);

	// make clone without password
	let userWithoutPass = JSON.parse(JSON.stringify(user));
	delete userWithoutPass.password;

	res.json(userWithoutPass);
});

userRouter.route("/:type").patch(async (req, res) => {
	if (!req.session.auth.username) return res.sendStatus(401);

	let answerType = req.params.type;

	// return if not on either route
	if (answerType !== "flags" && answerType !== "capitals") {
		return res.sendStatus(404);
	}

	// try to find user index
	let userID = usersDB.data.findIndex(
		(el) => el.username === req.session.auth.username,
	);

	// return if user not found
	if (userID === -1) return res.sendStatus(404);

	// return if answer not provided
	if (!req.body.answer) return res.sendStatus(400);

	// push answer to users results based on type
	if (answerType === "flags") {
		usersDB.data[userID].flags.answers.push(req.body.answer);
		usersDB.data[userID].flags.index += 1;
	}
	if (answerType === "capitals") {
		usersDB.data[userID].capitals.answers.push(req.body.answer);
		usersDB.data[userID].capitals.index += 1;
	}

	// increase user index
	await usersDB.write();

	res.sendStatus(202);
});

export { userRouter };
