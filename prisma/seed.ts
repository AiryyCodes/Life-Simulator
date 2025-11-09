import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type Vehicle = {
	modelHash: number;
	modelName: string;
	name: string;
	class: string;
};

const vehicles: Vehicle[] = [
	{
		modelHash: 0xd86a0247,
		modelName: "krieger",
		name: "Krieger",
		class: "Super",
	},
];

async function main() {
	for (const vehicle of vehicles) {
		const v = await prisma.vehicle.upsert({
			where: { modelHash: vehicle.modelHash },
			update: {},
			create: vehicle,
		});
		console.log("Seeded vehicle:", v.name);
	}
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
