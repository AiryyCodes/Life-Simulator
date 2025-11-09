export function getPercentage(value: number, maxValue: number): number {
	return Math.round((value / maxValue) * 100);
}
