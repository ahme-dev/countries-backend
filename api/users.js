import { Router } from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

// config and read lowdb
const usersDB = new Low(new JSONFile("data/users.json"));
await usersDB.read();

// create router
const usersRouter = Router();

// routes

usersRouter
	.route("/")
	.get(async (req, res) => {
		// remove passwords from returned users list
		let usersClone = JSON.parse(JSON.stringify(usersDB.data));
		let usersWithoutPass = usersClone.map((el) => {
			delete el.password;
			return el;
		});

		res.json(usersWithoutPass);
	})
	.post(async (req, res) => {
		// return if username and password are not provided
		if (!req.body.username || !req.body.password) return res.sendStatus(400);

		// make new user using body content
		let newUser = {
			username: req.body.username,
			password: req.body.password,
			flags: {
				index: 0,
				answers: [],
			},
			capitals: {
				index: 0,
				answers: [],
			},
		};

		// add new user into list
		usersDB.data.push(newUser);
		await usersDB.write();

		res.sendStatus(201);
	});

usersRouter.route("/:username").get(async (req, res) => {
	// find user
	let user = usersDB.data.find((el) => el.username === req.params.username);

	// return if user not found
	if (!user) return res.sendStatus(404);

	// make clone without password
	let userWithoutPass = JSON.parse(JSON.stringify(user));
	delete userWithoutPass.password;

	res.json(userWithoutPass);
});

usersRouter.route("/:username/:type").patch(async (req, res) => {
	let answerType = req.params.type;
	console.log(answerType);

	// return if not on either route
	if (answerType !== "flags" && answerType !== "capitals") {
		return res.sendStatus(404);
	}

	// try to find user index
	let userID = usersDB.data.findIndex(
		(el) => el.username === req.params.username,
	);

	// return if user not found
	if (userID === -1) return res.sendStatus(404);

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

export { usersRouter };
