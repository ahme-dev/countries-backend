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

let PORT = process.env.PORT || 3000;

// run server
app.listen(PORT, () => {
	`Running on (${PORT})`;
});
