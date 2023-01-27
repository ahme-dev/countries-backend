import LocalStrategy from "passport-local";
import passport from "passport";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

// config and read lowdb
const usersDB = new Low(new JSONFile("data/users.json"));
await usersDB.read();

passport.serializeUser((user, done) => {
	return done(null, user.username);
});

passport.deserializeUser((username, done) => {
	let user = usersDB.data.find((el) => el.username === username);
	return done(null, user);
});

passport.use(
	new LocalStrategy((username, password, done) => {
		let user = usersDB.data.find((el) => el.username === username);

		if (!user) return done(null, false);

		if (user.password !== password) return done(null, false);

		return done(null, user);
	}),
);
