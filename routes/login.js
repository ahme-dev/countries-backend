import { Router } from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

// config and read lowdb
const usersDB = new Low(new JSONFile("data/users.json"));
await usersDB.read();

// create router

const loginRouter = Router();

// route handlers

loginRouter.route("/").post(async (req, res) => {
	let reqUsersname = req.body.username;
	let reqPassword = req.body.password;

	// if not username and password provided return bad request
	if (!reqUsersname || !reqPassword) {
		return res.sendStatus(400);
	}

	// find user
	let user = usersDB.data.find((el) => el.username === reqUsersname);

	// if not found return not found
	if (!user) {
		return res.sendStatus(404);
	}

	// if incorrect password return unauth
	if (user.password !== reqPassword) {
		return res.sendStatus(401);
	}

	// set auth data in session
	req.session.auth = {
		username: user.username,
	};

	return res.sendStatus(200);
});

export { loginRouter };
