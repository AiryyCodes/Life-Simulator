import type { PageKey } from "@/views/admin/AdminMenu";
import { create } from "zustand";

export interface AdminState {
	page: PageKey;
	updatePage: (page: PageKey) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
	page: "user",
	updatePage: (page: PageKey) => set({ page }),
}));
