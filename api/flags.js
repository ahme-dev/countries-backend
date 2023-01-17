import { Router } from "express";
import { db } from "../index.js";

const flagsRouter = Router();

flagsRouter.route("/").get(async (req, res) => {
	res.json(db.data);
});

flagsRouter.route("/:id").get(async (req, res) => {
	let id = req.params.id;

	// return if no answer is given
	let answer = req.query.answer;
	if (!answer) return res.sendStatus(400);

	let correctAnswer = db.data[id].answer;
	let userAnswer = answer;
	let isCorrect = correctAnswer === userAnswer;

	res.json({ isCorrect, correctAnswer, userAnswer });
});

export { flagsRouter };
