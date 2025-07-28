'use client';

import MobileSidebar from './mobileSidebar';
import StaticSidebar from "./staticSidebar";

interface SidebarProps {
	isOverlay?: boolean;
	onClose?: () => void;
}

const Sidebar = ({ isOverlay = false, onClose }: SidebarProps) => {
	if (isOverlay && onClose) {
		return <MobileSidebar onClose={onClose} />;
	}

	return <StaticSidebar />;
};

export default Sidebar;