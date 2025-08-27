import SidebarContent from "./sidebarContent";

const StaticSidebar = () => {
  return (
    <aside className="hidden lg:block h-screen bg-white">
      <div className="pl-6 pt-6">
        <SidebarContent />
      </div>
    </aside>
  );
};

export default StaticSidebar;
