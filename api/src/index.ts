import { api } from "./http";
import { sync } from "./sync";

api().catch(console.error);
// sync().catch(console.error);
