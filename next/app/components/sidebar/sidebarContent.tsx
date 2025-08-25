import Image from "next/image";
import logo from "@/app/assets/logo.svg";
import { SIDEBAR_ITEMS } from "@/app/constants/sidebar";
import SidebarItem from "./sidebarItem";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  onNavigate?: () => void;
}

const SidebarContent = ({ onNavigate }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const handleItemClick = (path: string) => {
    router.push(path);
    if (onNavigate) onNavigate();
  };
  const isPathActive = (itemPath: string, currentPath: string): boolean => {
    if (itemPath === "/") {
      return currentPath === "/";
    }

    return currentPath === itemPath || currentPath.startsWith(itemPath + "/");
  };
  const handleLogoClick = () => {
    router.push("/");
    if (onNavigate) onNavigate();
  };

  return (
    <>
      <div
        className="flex w-full items-center gap-3 mb-5 cursor-pointer"
        onClick={handleLogoClick}
      >
        <Image src={logo} alt="Logo" />
      </div>
      <nav className="space-y-2 ">
        {SIDEBAR_ITEMS.map((item) => (
          <SidebarItem
            key={item.label}
            icon={item.icon}
            text={item.label}
            isSelected={isPathActive(item.path, pathname)}
            onClick={() => handleItemClick(item.path)}
          />
        ))}
      </nav>
    </>
  );
};

export default SidebarContent;
