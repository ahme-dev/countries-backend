import { Router } from "express";
import { db } from "../index.js";

const flagsRouter = Router();

flagsRouter.route("/").get(async (req, res) => {
	res.json(db.data);
});

flagsRouter.route("/:id").get(async (req, res) => {
	let id = req.params.id;

	res.json(db.data[id]);
});

export { flagsRouter };
