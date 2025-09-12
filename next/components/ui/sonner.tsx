"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster"
      toastOptions={{
        classNames: {
          description: "text-sm",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
