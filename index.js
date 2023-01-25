import express, { json } from "express";
import { flagsRouter } from "./routes/flags.js";
import { loginRouter } from "./routes/login.js";
import { userRouter } from "./routes/user.js";
import cors from "cors";
const app = express();

// import session related packages
import session from "express-session";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import lowdbStore from "connect-lowdb";

// create lowdb db and lowdb session store
const adapter = new JSONFile("data/sessions.json");
const db = new Low(adapter);
const LowdbStore = lowdbStore(session);

// middleware

app.use(
	// add session middlware using lowdb store
	session({
		store: new LowdbStore({ db }),
		resave: false,
		saveUninitialized: true,
		secret: "keyboard cat",
		cookie: {
			maxAge: 1000 * 60 * 60 * 24,
		},
	}),

	json(),
	cors(), // to be configured later
);

// routers

app.use("/flags", flagsRouter);
app.use("/user", userRouter);
app.use("/login", loginRouter);

// not found routes
app.all("*", (req, res) => {
	return res.sendStatus(404);
});

// run

let PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	`Running on (${PORT})`;
});
