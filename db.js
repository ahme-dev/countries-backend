import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

// config and read lowdb
export const usersDB = new Low(new JSONFile("data/users.json"));
await usersDB.read();
export const flagsDB = new Low(new JSONFile("data/flags.json"));
await flagsDB.read();
