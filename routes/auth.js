import { Router } from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

// config and read lowdb
const usersDB = new Low(new JSONFile("data/users.json"));
await usersDB.read();

export const authRouter = Router();

authRouter.post("/login", (req, res) => {
	// if no username and password provided return bad request
	if (!req.body.username || req.body.password) return res.sendStatus(400);

	// try to find user
	let user = usersDB.data.find((el) => el.username === req.body.username);

	// if user not found return not found
	if (!user) return res.sendStatus(404);

	// if password is wrong return not found
	if (user.password !== req.body.password) return res.sendStatus(404);

	// otherwise save username in session
	req.session.username = user.username;

	return res.sendStatus(200);
});

authRouter.post("/register", async (req, res) => {
	// if no username and password provided return bad request
	if (!req.body.username || req.body.password) return res.sendStatus(400);

	// try to find user with same username
	let user = usersDB.data.find((el) => el.username === req.body.username);

	// if user found return bad request
	if (user) return res.sendStatus(400);

	// create new user from provided values
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

	// push new user into db and write
	usersDB.data.push(newUser);
	await usersDB.write();

	return res.sendStatus(200);
});
