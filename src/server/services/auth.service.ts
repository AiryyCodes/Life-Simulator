import { EventHandler } from "@/decorators/event";
import type { RPCInfo } from "@/types/rpc";
import myRpc, { RPCHandler } from "@shared/rpc/rpc";
import { Service } from "@shared/service/service";
import { DataService } from "./data.service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

@Service({ side: "server" })
export class AuthService {
	constructor(private dataService: DataService) {}

	onInit() {
		if (!JWT_SECRET) throw new Error("Missing JWT_SECRET in environment variables");
	}

	@EventHandler("playerReady")
	async onPlayerReady(player: PlayerMp) {
		const status = await myRpc.callClient(player, "client:auth:login:auto");
		if (status) return;

		myRpc.callClient(player, "client:auth:menu:show");
	}

	@RPCHandler("server:auth:login")
	private async onLogin(info: RPCInfo, email: string, password: string) {
		const player = info.player;
		if (!player) return null;

		// Find user by email
		const user = await this.dataService.client.player.findUnique({
			where: { email },
		});

		if (!user) {
			console.log("A player tried to login but found no account.");
			return null;
		}

		// Check password
		const valid = await bcrypt.compare(password, user.password);
		if (!valid) {
			return null;
		}

		// Attach session or mark player as logged in
		player.setVariable("userId", user.id);

		const token = this.generateToken(user.id);
		myRpc.callClient(player, "client:auth:login:success", token);

		return user;
	}

	@RPCHandler("server:auth:login:auto")
	private async onAutoLogin(info: RPCInfo, token: string) {
		const player = info.player;
		if (!player) return null;

		if (!JWT_SECRET) throw new Error("Missing JWT_SECRET in environment variables");
		const decodedJwt = jwt.verify(token, JWT_SECRET) as { userId: number };

		// Find user by email
		const user = await this.dataService.client.player.findUnique({
			where: { id: decodedJwt.userId },
		});

		if (!user) {
			console.log("A player tried to login but found no account.");
			return null;
		}

		// Attach session or mark player as logged in
		player.setVariable("userId", user.id);

		myRpc.callClient(player, "client:auth:login:success", token);

		return user;
	}

	@RPCHandler("server:auth:register")
	private async onRegister(info: RPCInfo, username: string, email: string, password: string, confirmPassword: string): Promise<string | null> {
		const player = info.player;
		if (!player) return null;

		if (password !== confirmPassword) {
			return "Passwords do not match";
		}

		// Find user by email
		const existing = await this.dataService.client.player.findFirst({
			where: {
				OR: [{ email }, { username }],
			},
		});

		if (existing) {
			if (existing.email === email) {
				return "Email is already taken";
			} else {
				return "Username is already taken";
			}
		}

		const passwordHash = await bcrypt.hash(password, 10);

		const newPlayer = await this.dataService.client.player.create({
			data: {
				username: username,
				email: email,
				password: passwordHash,
			},
		});

		console.log(`Player ${username} registered successfully.`);

		return null;
	}

	private generateToken(userId: number) {
		if (!JWT_SECRET) throw new Error("Missing JWT_SECRET in environment variables");

		return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
	}
}
