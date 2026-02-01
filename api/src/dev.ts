import { api } from "./app";
import { db } from "./database";
import { sync } from "./sync";

api().catch(console.error);
sync().catch(console.error);
