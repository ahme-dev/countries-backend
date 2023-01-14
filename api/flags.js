import { Router } from "express";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const flagsRouter = Router();

flagsRouter.route("/").get(async (req, res) => {
	// config lowdb
	const file = "data/flags.json";
	const adapter = new JSONFile(file);
	const db = new Low(adapter);

	await db.read();

	if (db.data) {
		res.send("Already have data");
	}

	const fetchRes = await fetch(
		"https://shadify.dev/api/countries/country-quiz?amount=20",
	);
	// get data
	const fetchData = await fetchRes.json();
	console.log("datais ", fetchData);
	// fix flag sizes
	const fetchDataFixed = fetchData.map((el) => ({
		...el,
		flag: el.flag.replace("w320", "256x192"),
	}));

	db.data = fetchDataFixed;

	await db.write();

	res.send("Flags Hello");
});

export { flagsRouter };
