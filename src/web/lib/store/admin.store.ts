import type { PageKey } from "@/views/admin/AdminMenu";
import { create } from "zustand";

export interface AdminState {
	page: PageKey;
	updatePage: (page: PageKey) => void;
	noclip: boolean;
	updateNoclip: (state: boolean) => void;
	godmode: boolean;
	updateGodmode: (state: boolean) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
	page: "user",
	updatePage: (page: PageKey) => set({ page }),
	noclip: false,
	updateNoclip: (state: boolean) => set({ noclip: state }),
	godmode: false,
	updateGodmode: (state: boolean) => set({ godmode: state }),
}));
