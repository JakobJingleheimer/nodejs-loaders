import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("./tsx.mjs", pathToFileURL("./"))
