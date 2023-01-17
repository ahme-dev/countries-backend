import { Router } from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

// config and read lowdb
const flagsDB = new Low(new JSONFile("data/flags.json"));
await flagsDB.read();

// create router
const flagsRouter = Router();

// routes

flagsRouter.route("/").get(async (req, res) => {
	let data = flagsDB.data;

	res.json(data);
});

flagsRouter.route("/:id").get(async (req, res) => {
	let id = req.params.id;

	// return if out of length
	if (id > 520) return res.sendStatus(404);

	// return question if no answer is given
	if (!req.query.answer) {
		let question = flagsDB.data[id];
		delete question.answer;
		return res.json(question);
	}

	let correctAnswer = flagsDB.data[id].answer;
	let userAnswer = req.query.answer;
	let isCorrect = correctAnswer === userAnswer;

	res.json({ isCorrect, correctAnswer, userAnswer });
});

export { flagsRouter };
