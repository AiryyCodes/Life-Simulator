import Card from "@/components/card/Card";
import { cn } from "@lib/utils/cn";
import type React from "react";

export type StatusCardProps = {
	label: string;
	labelClassName?: string;

	icon: React.ReactNode;
	iconBg?: string;

	status: React.ReactNode;

	className?: string;

	children?: React.ReactNode;
};

export default function StatusCard({ label, labelClassName, status, icon, children, iconBg, className }: StatusCardProps) {
	return (
		<Card className={cn("h-full", className)}>
			<div className="flex flex-row gap-4">
				<div className={cn("bg-primary rounded-2xl p-4 aspect-square flex items-center justify-center", iconBg)}>{icon}</div>
				<div>
					<h1 className={cn("text-xl font-medium", labelClassName)}>{label}</h1>
					{status}
				</div>
			</div>
			{children && <div className="h-full flex flex-col justify-end">{children}</div>}
		</Card>
	);
}
