import { MdHome, MdGroupAdd, MdSearch, MdAccountCircle, MdNotificationsNone} from "react-icons/md";
import { URL } from "@/app/constants/url";
import type { IconType } from 'react-icons';
type SidebarItem = {
	label: string;
	path: string;
	icon: IconType;
};
export const SIDEBAR_ITEMS = [
	{
		label: "대시보드",
		path: URL.HOME,
		icon: MdHome,
	},
	{
		label: "팀 찾기",
		path: URL.FIND_TEAM,
		icon: MdSearch,
	},
	{
		label: "팀원 찾기",
		path: URL.FIND_TEAMMATE,
		icon: MdGroupAdd,
	},
	{
		label: "마이페이지",
		path: URL.MY_PAGE,
		icon: MdAccountCircle,
	},
	{
		label: "내 알림",
		path: URL.MY_NOTIFICATIONS,
		icon: MdNotificationsNone,
	},

]