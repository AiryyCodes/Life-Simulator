import { Player } from "@prisma/client";
import { create } from "zustand";

export interface AuthState {
	player: Player | null;
	updatePlayer: (player: Player | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	player: null,
	updatePlayer: (player: Player | null) => set({ player }),
}));
