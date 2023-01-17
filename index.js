import express, { json } from "express";
import { flagsRouter } from "./api/flags.js";
import { usersRouter } from "./api/users.js";
import cors from "cors";
const app = express();

// middleware

app.use(
	json(),
	cors(), // to be configured later
);

// routers

app.use("/flags", flagsRouter);
app.use("/users", usersRouter);
// app.use("/capitals", require("./api/capitals"));

// not found routes
app.all("*", (req, res) => {
	res.status(404);
});

// run

let PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	`Running on (${PORT})`;
});
