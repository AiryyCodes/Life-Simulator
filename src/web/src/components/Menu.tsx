import { cn } from "@lib/utils/cn";

type MenuProps = {
	className?: string;
	children?: React.ReactNode;
};

export default function Menu({ className, children }: MenuProps) {
	return <div className={cn("flex flex-col gap-4 bg-background p-4 rounded-2xl shadow-xl", className)}>{children}</div>;
}
