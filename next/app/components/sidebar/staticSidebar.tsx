import SidebarContent from "./sidebarContent";

const StaticSidebar = () => {
  return (
    <aside className="hidden h-screen bg-white lg:block">
      <div className="pl-6 pt-6">
        <SidebarContent />
      </div>
    </aside>
  );
};

export default StaticSidebar;
