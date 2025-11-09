export type LabelProps = {
	label?: string;
};

export default function Label({ label }: LabelProps) {
	return <h1 className="text-xl">{label}</h1>;
}
