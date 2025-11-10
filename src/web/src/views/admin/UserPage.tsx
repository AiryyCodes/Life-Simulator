import { BoltIcon, HeartIcon } from "@heroicons/react/24/solid";
import myRpc from "@shared/rpc/rpc";
import ActionCard from "./ActionCard";
import Label from "@/components/Label";
import Button from "@/components/button/Button";
import Card from "@/components/card/Card";
import { getPercentage } from "@lib/utils/utils";
import { useMainStore } from "@lib/store/main.store";
import StatusCard from "./StatusCard";
import Switch from "@/components/Switch";
import { cn } from "@lib/utils/cn";
import { useAdminStore } from "@lib/store/admin.store";

export default function UserPage() {
	const player = useMainStore((state) => state.player);
	const adminState = useAdminStore((state) => state);

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
				<div className="grid grid-cols-2 gap-4">
					<ActionCard label="God Mode" icon={<HeartIcon className="size-8" />}>
						<div className="flex flex-row justify-between items-center">
							<div className={cn("border-2 border-background-light rounded-xl px-2 py-1")}>
								<p className="font-medium text-background-lightest">{adminState.godmode ? "On" : "Off"}</p>
							</div>
							<Switch
								checked={adminState.godmode}
								onCheckedChange={async (checked) => {
									adminState.updateGodmode(checked);
									const toggled = await myRpc.callClient("client:admin:godmode:toggle", checked);
									adminState.updateGodmode(toggled);
								}}
							/>
						</div>
					</ActionCard>
					<ActionCard label="Noclip" icon={<BoltIcon className="size-8" />}>
						<div className="flex flex-row justify-between items-center">
							<div className={cn("border-2 border-background-light rounded-xl px-2 py-1")}>
								<p className="font-medium text-background-lightest">{adminState.noclip ? "On" : "Off"}</p>
							</div>
							<Switch
								checked={adminState.noclip}
								onCheckedChange={async (checked) => {
									adminState.updateNoclip(checked);
									const toggled = await myRpc.callClient("client:admin:noclip:toggle", checked);
									adminState.updateNoclip(toggled);
								}}
							/>
						</div>
					</ActionCard>
					<ActionCard label="Heal Yourself" icon={<HeartIcon className="size-8" />}>
						<Button startElement="Heal" className="justify-center" onClick={() => myRpc.callServer("server:admin:heal")} />
					</ActionCard>
				</div>
			</div>
		</div>
	);
}
