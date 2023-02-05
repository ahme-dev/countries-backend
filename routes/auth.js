import { Router } from "express";
import { usersDB } from "../db.js";
import bcrypt from "bcrypt";
import { requireAuth } from "../middleware/requireAuth.js";

export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
	// if no username and password provided return
	if (!req.body.username || !req.body.password) {
		return res
			.status(400)
			.json({ message: "Provide a username and a password." });
	}

	// try to find user
	let user = usersDB.data.find((el) => el.username === req.body.username);

	// if user not found return
	if (!user)
		return res.status(404).json({ message: `Username does not exist.` });

	let reqHash = await bcrypt.hash(req.body.password, user.salt);

	// if password is wrong return
	if (user.hash !== reqHash)
		return res.status(404).json({
			message: "Password is incorrect.",
		});

	// otherwise save username in session
	req.session.username = user.username;

	return res.status(200).json({ message: `Logged in as ${user.username}.` });
});

authRouter.post("/register", async (req, res) => {
	// if no username and password provided return
	if (!req.body.username || !req.body.password) {
		return res
			.status(400)
			.json({ message: "Please provide a username and a password." });
	}

	// try to find user with same username
	let user = usersDB.data.find((el) => el.username === req.body.username);

	// if user found return
	if (user) return res.status(401).json({ message: `Username is reserved.` });

	let reqSalt = await bcrypt.genSalt(10);
	let reqHash = await bcrypt.hash(req.body.password, reqSalt);

	// create new user from provided values
	let newUser = {
		username: req.body.username,
		hash: reqHash,
		salt: reqSalt,
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

	// save username in session
	req.session.username = newUser.username;

	return res.sendStatus(200);
});

authRouter.post("/logout", requireAuth, (req, res) => {
	// delete session
	req.session.destroy();

	return res.sendStatus(200);
});
