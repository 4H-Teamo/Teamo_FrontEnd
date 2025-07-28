import SidebarContent from './sidebarContent';

const StaticSidebar = () => {
	return (
		<aside className="hidden lg:block h-screen bg-white">
			<div className="p-6">
				<SidebarContent />
			</div>
		</aside>
	);
};

export default StaticSidebar;