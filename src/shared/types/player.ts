import { VehicleInfo } from "@shared/types/vehicle";

export type PlayerInfo = {
	name: string;
	health: number;
	maxHealth: number;

	vehicle: VehicleInfo | null;
};
