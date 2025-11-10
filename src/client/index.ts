import "@/bootstrap";
import "@/services";
import { EventManager } from "@shared/event/event";
import { ServiceManager } from "@shared/service/service";

mp.game.gameplay.setFadeOutAfterDeath(false);

ServiceManager.init();

EventManager.init((name, callback) => {
	mp.events.add(name, callback);
});
