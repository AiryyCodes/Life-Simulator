import { cn } from "@lib/utils/cn";

export type CardProps = {
	children?: React.ReactNode;
	className?: string;
};

export default function Card({ children, className }: CardProps) {
	return <div className={cn("flex flex-col gap-4 bg-background-dark rounded-xl p-4", className)}>{children}</div>;
}
