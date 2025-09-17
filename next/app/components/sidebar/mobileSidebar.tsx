"use client";

import { motion, AnimatePresence } from "framer-motion";
import SidebarContent from "./sidebarContent";
import ChatIconComponent from "../chat/chatWidget";

interface MobileSidebarProps {
  onClose: () => void;
}

const slideVariants = {
  hidden: { x: "-100%" },
  visible: { x: 0 },
  exit: { x: "-100%" },
};

const MobileSidebar = ({ onClose }: MobileSidebarProps) => {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 lg:hidden" onClick={onClose}>
        <motion.aside
          className="absolute left-0 top-0 h-full w-64 max-w-full bg-white flex flex-col"
          variants={slideVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: "tween", duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 flex-1">
            <button className="mb-4 text-gray-600" onClick={onClose}>
              ✕ 닫기
            </button>
            <SidebarContent onNavigate={onClose} />
          </div>
          <div className="p-6">
            <ChatIconComponent />
          </div>
        </motion.aside>
      </div>
    </AnimatePresence>
  );
};

export default MobileSidebar;
