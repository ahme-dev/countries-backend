import { Router } from "express";

import passport from "passport";

export const authRouter = Router();

authRouter.post("/login", passport.authenticate("local"), (req, res) => {
	res.sendStatus(200);
});
