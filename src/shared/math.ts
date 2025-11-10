class Vector3 {
	constructor(
		public x: number,
		public y: number,
		public z: number,
	) {}
}

export function cross(v1: Vector3, v2: Vector3) {
	let vector = new Vector3(0, 0, 0);
	vector.x = v1.x * v2.z - v1.z * v2.y;
	vector.y = v1.z * v2.x - v1.x * v2.z;
	vector.z = v1.x * v2.y - v1.y * v2.x;
	return vector;
}

export function normalize(vector: Vector3) {
	const mag = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z);
	vector.x = vector.x / mag;
	vector.y = vector.y / mag;
	vector.z = vector.z / mag;
	return vector;
}
