import { Router } from "express";
import { getDB } from "../data/db.js";

// create router

const flagsRouter = Router();

// route handlers

flagsRouter.route("/:lang/").get(async (req, res) => {
	let lang = req.params.lang;

	let db = await getDB(`data/${lang}/flags.json`);

	res.json(db.data);
});

flagsRouter.route("/:lang/:id").get(async (req, res) => {
	let id = req.params.id;
	let lang = req.params.lang;

	let db = await getDB(`data/${lang}/flags.json`);

	// return if out of length
	if (id > 520) return res.sendStatus(404);

	// return question if no answer is given
	if (!req.query.answer) {
		let question = db.data[id];
		let questionClone = JSON.parse(JSON.stringify(question));
		delete questionClone.answer;
		return res.json(questionClone);
	}

	let correctAnswer = db.data[id].answer;
	let userAnswer = req.query.answer;
	let isCorrect = correctAnswer === userAnswer;

	res.json({ isCorrect, correctAnswer, userAnswer });
});

export { flagsRouter };
