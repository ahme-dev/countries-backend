import express, { json } from "express";
import { flagsRouter } from "./routes/flags.js";
import { loginRouter } from "./routes/login.js";
import { userRouter } from "./routes/user.js";
import { authRouter } from "./routes/auth.js";
import cors from "cors";
const app = express();

// import session related packages
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import session from "express-session";
import lowdbStore from "connect-lowdb";

import passport from "passport";
import "./routes/authUtils.js";

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

	passport.initialize(),
	passport.session(),

	json(),
	cors({
		// to be configured later
		origin: ["http://localhost:5173", "https://countries.ahmed.systems"],
	}),
);

// routers

app.use("/flags", flagsRouter);
app.use("/user", userRouter);
app.use("/auth", authRouter);
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
