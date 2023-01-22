import { Router } from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

// config and read lowdb
const db = new Low(new JSONFile("data/flags.json"));
await db.read();

// create router

const flagsRouter = Router();

// route handlers

flagsRouter.route("/").get(async (req, res) => {
	let viewCount = req.session.viewCount;

	req.session.viewCount = viewCount ? viewCount + 1 : 1;
	console.log(viewCount);

	res.json(db.data);
});

flagsRouter.route("/:id").get(async (req, res) => {
	let id = req.params.id;

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
