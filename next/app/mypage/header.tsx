import Button from "@/app/components/button/button";
import React from "react";

interface HeaderProps {
  onSubmit: () => void;
}

const Header = ({ onSubmit }: HeaderProps) => {
  return (
    <header className="w-full flex justify-end items-center">
      <div className="flex items-center gap-x-10 mr-6">
        <Button className="button-common" onClick={onSubmit}>
          저장
        </Button>
      </div>
    </header>
  );
};

export default Header;
