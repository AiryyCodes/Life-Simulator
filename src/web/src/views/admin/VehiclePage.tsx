import Label from "@/components/Label";
import ActionCard from "./ActionCard";
import { HeartIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/solid";
import myRpc from "@shared/rpc/rpc";
import Card from "@/components/card/Card";
import { useMainStore } from "@lib/store/main.store";
import Button from "@/components/button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import Input from "@/components/input/Input";
import StatusCard from "./StatusCard";
import { getPercentage } from "@lib/utils/utils";

export default function VehiclePage() {
	const player = useMainStore((state) => state.player);
	const vehicle = player?.vehicle;

	const [vehicleModel, setVehicleModel] = useState("");
	const [numberPlate, setNumberPlate] = useState("");

	function spawnVehicle(vehicleModel: string): void {
		myRpc.callServer("server:admin:vehicle:spawn", vehicleModel);

		setVehicleModel("");
	}

	function changeNumberPlate(numberPlate: string): void {
		if (numberPlate.length > 8) return;

		myRpc.callServer("server:vehicle:plate:change", numberPlate);

		setNumberPlate("");
	}

	return (
		<div className="flex flex-row w-full gap-8">
			{vehicle && (
				<div className="flex flex-col gap-4 w-fit">
					<Label label="Current Vehicle" />
					<Card className="grid grid-cols-2 gap-4">
						<StatusCard
							label="Health"
							labelClassName="font-normal"
							icon={<HeartIcon className="size-8 text-background-lighter" />}
							className="bg-background-darker"
							iconBg="bg-background"
							status={<p className="text-primary-light text-lg font-bold">{getPercentage(vehicle?.health, vehicle?.maxHealth)}%</p>}
						/>
						<StatusCard
							label="Number Plate"
							labelClassName="font-normal"
							icon={<HeartIcon className="size-8 text-background-lighter" />}
							className="bg-background-darker"
							iconBg="bg-background"
							status={<p className="text-primary-light text-lg font-bold">{vehicle?.plate}</p>}
						/>
					</Card>
				</div>
			)}
			<div className="flex flex-col gap-4 w-fit">
				<Label label="Actions" />
				<div className="flex flex-col gap-4">
					<ActionCard label="Spawn Vehicle" icon={<FontAwesomeIcon icon={faCar} size="xl" className="w-8 h-8" />}>
						<div className="flex justify-end">
							<form
								className="flex flex-col gap-4"
								onSubmit={(e) => {
									e.preventDefault();
									spawnVehicle(vehicleModel);
								}}
							>
								<Input value={vehicleModel} onInput={(e) => setVehicleModel((e.target as HTMLInputElement).value)} />
								<Button startElement="Spawn" className="justify-center" />
							</form>
						</div>
					</ActionCard>
					{vehicle && (
						<div className="grid grid-cols-2 flex-wrap gap-4">
							<ActionCard label="Repair Vehicle" icon={<WrenchScrewdriverIcon className="size-8" />}>
								<Button
									startElement="Repair"
									className="justify-center"
									onClick={() => myRpc.callServer("server:admin:vehicle:repair")}
								/>
							</ActionCard>
							<ActionCard label="Number Plate" icon={<WrenchScrewdriverIcon className="size-8" />}>
								<form
									className="flex flex-col gap-4"
									onSubmit={(e) => {
										e.preventDefault();
										changeNumberPlate(numberPlate);
									}}
								>
									<Input value={numberPlate} onInput={(e) => setNumberPlate((e.target as HTMLInputElement).value)} />
									<Button startElement="Change" className="justify-center" />
								</form>
							</ActionCard>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
