import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import express, { json } from "express";
import { flagsRouter } from "./api/flags.js";
const app = express();

// config and read lowdb
const file = "data/flags.json";
const adapter = new JSONFile(file);
export const db = new Low(adapter);
await db.read();

// middleware
app.use(json());

// routes
app.use("/flags", flagsRouter);
// app.use("/capitals", require("./api/capitals"));

// not found routes
app.all("*", (req, res) => {
	res.status(404);
});

// run server
app.listen(3000, () => {
	"Running...";
});
