import { Router } from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

// config and read lowdb
const flagsDB = new Low(new JSONFile("data/flags.json"));
await flagsDB.read();

// create router

const flagsRouter = Router();

// route handlers

flagsRouter.route("/").get((req, res) => {
	res.json(flagsDB.data);
});

flagsRouter.route("/:id").get((req, res) => {
	let id = req.params.id;

	// return if out of length
	if (id > 520) return res.sendStatus(404);

	// return question if no answer is given
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
