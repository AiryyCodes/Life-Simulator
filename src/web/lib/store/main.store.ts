import type { PlayerInfo } from "@shared/types/player";
import { create } from "zustand";

export interface MainState {
	player: PlayerInfo | null;
	updatePlayer: (player: PlayerInfo) => void;
}

export const useMainStore = create<MainState>((set) => ({
	player: null,
	updatePlayer: (player: PlayerInfo) => set({ player }),
}));
