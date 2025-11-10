import { EventHandler } from "@/decorators/event";
import { PrismaClient } from "@prisma/client";
import { Service } from "@shared/service/service";

let prisma: PrismaClient;

@Service({ side: "server" })
export class DataService {
	get client(): PrismaClient {
		if (!prisma) {
			prisma = new PrismaClient();
		}
		return prisma;
	}

	@EventHandler("serverShutdown")
	onServerShutdown() {
		prisma?.$disconnect();
	}
}
