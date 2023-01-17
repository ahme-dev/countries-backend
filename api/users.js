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
		let usersWithoutPassword = [...usersDB.data].map((el) => {
			delete el.password;
			return el;
		});

		res.json(usersDB.data);
	})
	.post(async (req, res) => {
		// return if username and password are not provided
		if (!req.body.username || !req.body.password) return res.sendStatus(400);

		// make new user using body content
		let newUser = {
			username: req.body.username,
			password: req.body.password,
			results: [],
		};

		// add new user into list
		usersDB.data.push(newUser);
		await usersDB.write();

		res.sendStatus(201);
	});

usersRouter
	.route("/:username")
	.get(async (req, res) => {
		// find user
		let user = usersDB.data.find((el) => el.username === req.params.username);

		// return if user not found
		if (!user) return res.sendStatus(404);

		res.json({ username: user.username });
	})

	.patch(async (req, res) => {
		// try to find user index
		let userID = usersDB.data.findIndex(
			(el) => el.username === req.params.username,
		);

		// return if user not found
		if (userID === -1) return res.sendStatus(404);

		// push result to users results
		usersDB.data[userID].results.push(req.body.result);
		await usersDB.write();

		res.sendStatus(202);
	});

export { usersRouter };
