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
		res.json(usersDB.data);
	})
	.post(async (req, res) => {
		if (!req.body.username || !req.body.password) return res.sendStatus(400);

		let newUser = {
			username: req.body.username,
			password: req.body.password,
		};

		usersDB.data.push(newUser);
		await usersDB.write();

		res.sendStatus(201);
	});

usersRouter.route("/:username").get(async (req, res) => {
	let user = usersDB.data.find((el) => el.username === req.params.username);

	if (!user) return res.sendStatus(404);

	res.json({ username: user.username });
});

export { usersRouter };
