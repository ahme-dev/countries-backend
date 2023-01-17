import { Router } from "express";
import { db } from "../index.js";

const flagsRouter = Router();

flagsRouter.route("/").get(async (req, res) => {
	let data = db.data;

	res.json(data);
});

flagsRouter.route("/:id").get(async (req, res) => {
	let id = req.params.id;

	// return if out of length
	if (id > 520) return res.sendStatus(404);

	// return question if no answer is given
	if (!req.query.answer) {
		let question = db.data[id];
		delete question.answer;
		return res.json(question);
	}

	let correctAnswer = db.data[id].answer;
	let userAnswer = req.query.answer;
	let isCorrect = correctAnswer === userAnswer;

	res.json({ isCorrect, correctAnswer, userAnswer });
});

export { flagsRouter };
