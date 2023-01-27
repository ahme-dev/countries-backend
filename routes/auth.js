import { Router } from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

// config and read lowdb
const usersDB = new Low(new JSONFile("data/users.json"));
await usersDB.read();

export const authRouter = Router();

authRouter.post("/login", (req, res) => {
	let user = usersDB.data.find((el) => el.username === req.body.username);

	if (!user) return res.sendStatus(401);

	if (user.password !== req.body.password) return res.sendStatus(401);

	// save username in session
	req.session.username = user.username;

	return res.sendStatus(200);
});
