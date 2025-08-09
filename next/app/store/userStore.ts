import { create } from "zustand";
import { User} from "@/app/model/type";


interface UserStore {
	user: User | null;
	setUser: (data: User) => void;
	clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
	user: null,
	setUser: (data) => set({ user: data }),
	clearUser: () => set({ user: null }),
}));
export const defaultUser: User = {
	userId: "",
	nickName: "",
	description: "",
	location: "",
	image: "",
	github: "",
	workMode: undefined,
	beginner: false,
	isPublic: false,
	stacks: [],
	createdAt: undefined,
	updatedAt: undefined,
	positionId: "",
	posts: [],
	comments: [],
	notices: [],
};