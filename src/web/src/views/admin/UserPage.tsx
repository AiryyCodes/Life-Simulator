import { HeartIcon } from "@heroicons/react/24/solid";
import myRpc from "@shared/rpc/rpc";
import ActionCard from "./ActionCard";
import Label from "@/components/Label";
import Button from "@/components/button/Button";
import Card from "@/components/card/Card";
import { getPercentage } from "@lib/utils/utils";
import { useMainStore } from "@lib/store/main.store";
import StatusCard from "./StatusCard";

export default function UserPage() {
	const player = useMainStore((state) => state.player);

	if (!player) return null;

	return (
		<div className="flex flex-row w-full gap-8">
			<div className="flex flex-col gap-4 w-fit">
				<Label label="Personal" />
				<Card className="grid grid-cols-2 gap-4">
					<StatusCard
						label="Health"
						labelClassName="font-normal"
						icon={<HeartIcon className="size-8 text-background-lighter" />}
						className="bg-background-darker"
						iconBg="bg-background"
						status={<p className="text-primary-light text-lg font-bold">{getPercentage(player.health, player.maxHealth)}%</p>}
					/>
				</Card>
			</div>
			<div className="flex flex-col gap-4 w-fit">
				<Label label="Actions" />
				<div className="flex gap-4">
					<ActionCard label="Heal Yourself" icon={<HeartIcon className="size-8" />}>
						<Button startElement="Heal" className="justify-center" onClick={() => myRpc.callClient("admin:heal")} />
					</ActionCard>
				</div>
			</div>
		</div>
	);
}
