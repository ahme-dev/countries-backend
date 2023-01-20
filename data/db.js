import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

export async function getDB(location) {
	const db = new Low(new JSONFile(location));
	await db.read();
	return db;
}
