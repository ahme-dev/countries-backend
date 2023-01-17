import { Router } from "express";
import { db } from "../index.js";

const flagsRouter = Router();

flagsRouter.route("/").get(async (req, res) => {
	let dataWithoutAnswer = [...db.data].map((el) => {
		delete el.answer;
		return el;
	});

	res.json(dataWithoutAnswer);
});

flagsRouter.route("/:id").get(async (req, res) => {
	let id = req.params.id;

	// return if out of length
	if (id > 520) return res.sendStatus(404);

	// return if no answer is given
	if (!req.query.answer) return res.sendStatus(400);

	let correctAnswer = db.data[id].answer;
	let userAnswer = req.query.answer;
	let isCorrect = correctAnswer === userAnswer;

	res.json({ isCorrect, correctAnswer, userAnswer });
});

export { flagsRouter };
