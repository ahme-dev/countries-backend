import express, { json } from "express";
import { flagsRouter } from "./api/flags.js";
const app = express();

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
