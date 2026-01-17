import { api } from "./app";
import { sync } from "./sync";

api().catch(console.error);
sync().catch(console.error);
