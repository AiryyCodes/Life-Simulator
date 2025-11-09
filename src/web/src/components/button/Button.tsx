import type React from "react";

import "./Button.css";
import { cn } from "@lib/utils/cn";
import myRpc from "@shared/rpc/rpc";
import { useMainStore } from "@lib/store/main.store";

export type ButtonProps = {
	startElement?: React.ReactNode;
	endElement?: React.ReactNode;

	className?: string;

	onClick?: () => void;
};

export default function Button({ startElement, endElement, className, onClick }: ButtonProps) {
	const updatePlayer = useMainStore((state) => state.updatePlayer);

	return (
		<button
			onClick={async () => {
				if (!onClick) return;

				onClick();

				const player = await myRpc.callClient("admin:player:get");
				updatePlayer(player);
			}}
			className={cn("my-button flex flex-row justify-between transition-all bg-primary px-4 py-2 rounded-xl w-full", className)}
		>
			{startElement}
			{endElement}
		</button>
	);
}
