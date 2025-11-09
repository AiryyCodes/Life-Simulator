import path from "path";
import { config } from "dotenv";
import { setEnvironment } from "@shared/env";

setEnvironment("server");

config({
	path: path.resolve(".env"),
});
