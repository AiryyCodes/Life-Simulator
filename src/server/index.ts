import "@/bootstrap";
import "@/services";

import { ServiceManager } from "@shared/service/service";
import { EventManager } from "@shared/event/event";
import { CommandManager } from "./command/command";

ServiceManager.init();
CommandManager.init();
EventManager.init((name, callback) => {
	mp.events.add(name, callback);
});
