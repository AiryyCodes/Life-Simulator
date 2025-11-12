export class Vector3 {
	constructor(
		public x: number,
		public y: number,
		public z: number,
	) {}
}

export function cross(a: Vector3, b: Vector3): Vector3 {
	return new Vector3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
}

export function normalize(v: Vector3): Vector3 {
	const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
	return len > 0 ? new Vector3(v.x / len, v.y / len, v.z / len) : new Vector3(0, 0, 0);
}
