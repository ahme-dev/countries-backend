import { Router } from "express";
import { flagsDB } from "../db.js";

// create router

const flagsRouter = Router();

// route handlers

flagsRouter.route("/").get((req, res) => {
	res.json(flagsDB.data);
});

flagsRouter.route("/:id").get((req, res) => {
	let id = req.params.id;

	// if out of length return
	if (id > 520) return res.sendStatus(404);

	// if no answer is given return question
	if (!req.query.answer) {
		let question = flagsDB.data[id];
		let questionClone = JSON.parse(JSON.stringify(question));
		delete questionClone.answer;
		return res.json(questionClone);
	}

	let correctAnswer = flagsDB.data[id].answer;
	let userAnswer = req.query.answer;
	let isCorrect = correctAnswer === userAnswer;

	res.json({ isCorrect, correctAnswer, userAnswer });
});

export { flagsRouter };
