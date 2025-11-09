import { VehicleInfo } from "./vehicle";

export type PlayerInfo = {
	name: string;
	health: number;
	maxHealth: number;

	vehicle: VehicleInfo | null;
};
