import Menu from "@/components/Menu";
import { UserIcon } from "@heroicons/react/24/solid";
import type React from "react";
import UserPage from "./UserPage";
import { motion, AnimatePresence } from "framer-motion";

import "./AdminMenu.css";
import VehiclePage from "./VehiclePage";
import { cn } from "@lib/utils/cn";
import { useMainStore } from "@lib/store/main.store";
import { useAdminStore } from "@lib/store/admin.store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCar } from "@fortawesome/free-solid-svg-icons";

const pages = {
	user: <UserPage />,
	vehicle: <VehiclePage />,
} as const;

export type PageKey = keyof typeof pages;

type NavButtonProps = {
	icon: React.ReactNode;

	selected?: boolean;

	onClick: () => void;
};

function AdminNavButton({ icon, selected = false, ...props }: NavButtonProps) {
	return (
		<button
			className={cn(
				"transition-colors rounded-xl w-12 h-12 flex items-center justify-center",
				selected ? "bg-primary text-white nav-button-selected" : "bg-transparent nav-button",
			)}
			{...props}
		>
			{icon}
		</button>
	);
}

export default function AdminMenu() {
	const player = useMainStore((state) => state.player);
	const state = useAdminStore();

	if (!player) return null;

	return (
		<Menu className="flex-row transition-all min-w-3xl">
			<Menu className="bg-background-darker justify-between">
				<div className="flex flex-col gap-4">
					<AdminNavButton
						icon={<UserIcon className="size-5" />}
						onClick={() => state.updatePage("user")}
						selected={state.page === "user"}
					/>
					<AdminNavButton
						icon={<FontAwesomeIcon icon={faCar} className="w-6 h-6 aspect-square" />}
						onClick={() => state.updatePage("vehicle")}
						selected={state.page === "vehicle"}
					/>
				</div>
				<div className="mt-auto"></div>
			</Menu>
			<Menu className="transition-all flex-1 shadow-none">
				<AnimatePresence mode="wait">
					<motion.div
						key={state.page}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.1 }}
					>
						<div className="flex flex-col gap-8 w-full">
							<div className="flex flex-col gap-4 w-full">
								<h1 className="text-xl">
									<span className="text-primary font-medium">Welcome,</span> {player.name}!
								</h1>
							</div>
							{pages[state.page]}
						</div>
					</motion.div>
				</AnimatePresence>
			</Menu>
		</Menu>
	);
}
